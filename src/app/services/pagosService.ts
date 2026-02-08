import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Pago {
  idPago: number;
  idProveedor: number;
  nombreProveedor?: string;
  monto: number;
  fecha: string;
  estado: string;
  concepto: string;
  metodoPago?: string;
  numeroTransaccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/Pagos';

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  }

  private getHeadersXml() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/xml'
      }),
      responseType: 'text' as 'json'
    };
  }

  listarPagos(estado?: string, busqueda?: string): Observable<any> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (estado && estado !== 'Todos') params.push(`estado=${estado}`);
    if (busqueda) params.push(`busqueda=${busqueda}`);
    
    if (params.length > 0) url += `?${params.join('&')}`;

    return this.http.get(url, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    });
  }

  obtenerPagoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    });
  }

  crearPago(pago: any): Observable<any> {
    const xml = `
      <Pago>
        <IdProveedor>${pago.idProveedor}</IdProveedor>
        <Monto>${pago.monto}</Monto>
        <Fecha>${pago.fecha}</Fecha>
        <Estado>${pago.estado}</Estado>
        <Concepto>${this.escapeXml(pago.concepto)}</Concepto>
        <MetodoPago>${pago.metodoPago || ''}</MetodoPago>
        <NumeroTransaccion>${pago.numeroTransaccion || ''}</NumeroTransaccion>
      </Pago>
    `;
    
    return this.http.post(this.apiUrl, xml, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/xml'
      }),
      responseType: 'text'
    });
  }

  actualizarPago(id: number, pago: any): Observable<any> {
    const xml = `
      <Pago>
        <IdPago>${id}</IdPago>
        <IdProveedor>${pago.idProveedor}</IdProveedor>
        <Monto>${pago.monto}</Monto>
        <Fecha>${pago.fecha}</Fecha>
        <Estado>${pago.estado}</Estado>
        <Concepto>${this.escapeXml(pago.concepto)}</Concepto>
        <MetodoPago>${pago.metodoPago || ''}</MetodoPago>
        <NumeroTransaccion>${pago.numeroTransaccion || ''}</NumeroTransaccion>
      </Pago>
    `;
    
    return this.http.put(`${this.apiUrl}/${id}`, xml, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/xml'
      }),
      responseType: 'text'
    });
  }

  eliminarPago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    });
  }

  marcarComoPagado(id: number, metodoPago: string = 'Transferencia', numeroTransaccion?: string): Observable<any> {
    const xml = `
      <DatosPago>
        <MetodoPago>${metodoPago}</MetodoPago>
        ${numeroTransaccion ? `<NumeroTransaccion>${numeroTransaccion}</NumeroTransaccion>` : ''}
      </DatosPago>
    `;

    return this.http.patch(`${this.apiUrl}/${id}/marcar-pagado`, xml, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/xml'
      }),
      responseType: 'text'
    });
  }

  obtenerResumen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumen`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    });
  }

  // Métodos auxiliares para parsear XML
  parsearPagosXml(xmlString: string): Pago[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const pagosNodes = xmlDoc.getElementsByTagName('Pago');
    const pagos: Pago[] = [];

    for (let i = 0; i < pagosNodes.length; i++) {
      const pagoNode = pagosNodes[i];
      pagos.push({
        idPago: parseInt(this.getXmlValue(pagoNode, 'IdPago') || '0'),
        idProveedor: parseInt(this.getXmlValue(pagoNode, 'IdProveedor') || '0'),
        nombreProveedor: this.getXmlValue(pagoNode, 'NombreProveedor'),
        monto: parseFloat(this.getXmlValue(pagoNode, 'Monto') || '0'),
        fecha: this.getXmlValue(pagoNode, 'Fecha'),
        estado: this.getXmlValue(pagoNode, 'Estado'),
        concepto: this.getXmlValue(pagoNode, 'Concepto'),
        metodoPago: this.getXmlValue(pagoNode, 'MetodoPago'),
        numeroTransaccion: this.getXmlValue(pagoNode, 'NumeroTransaccion')
      });
    }

    return pagos;
  }

  parsearResumenXml(xmlString: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    return {
      totalPagado: parseFloat(this.getXmlValue(xmlDoc, 'TotalPagado') || '0'),
      totalPendiente: parseFloat(this.getXmlValue(xmlDoc, 'TotalPendiente') || '0'),
      totalVencido: parseFloat(this.getXmlValue(xmlDoc, 'TotalVencido') || '0'),
      totalGeneral: parseFloat(this.getXmlValue(xmlDoc, 'TotalGeneral') || '0')
    };
  }

  private getXmlValue(parent: any, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  }

  private escapeXml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}