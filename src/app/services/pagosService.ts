import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth';

export interface Pago {
  idPago?: number;
  idProveedor: number;
  nombreProveedor?: string;
  monto: number;
  fecha: string;
  estado: string;
  concepto: string;
  metodoPago?: string;
  numeroTransaccion?: string;
}

export interface ResumenPagos {
  totalPagado: number;
  pendiente: number;
  vencido: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private apiUrl = 'http://localhost:5000/api/Pagos';

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, application/xml' // Aceptar ambos
      })
    };
  }

  /**
   * Obtiene todos los pagos - SIGUIENDO EL MISMO PATRÓN QUE PROVEEDORES
   */
  getPagos(estado?: string, busqueda?: string): Observable<Pago[]> {
    console.log('💰 [PagosService] Obteniendo pagos con:', { estado, busqueda });
    
    // IMPORTANTE: Si tu backend necesita POST como proveedores, prueba esto:
    const body = {
      Estado: estado || null,
      Busqueda: busqueda || '',
      Transaccion: 'LISTAR'
    };
    
    console.log('📤 Body a enviar:', body);
    
    // Opción 1: Si tu backend acepta POST (como proveedores)
    return this.http.post(this.apiUrl, body, {
      ...this.getHeaders(),
      responseType: 'text' as 'json' // Para manejar XML o JSON
    }).pipe(
      map((res: any) => {
        console.log('📥 Respuesta cruda recibida:', typeof res, res?.substring?.(0, 200) || res);
        return this.parseResponse(res);
      }),
      tap(pagos => console.log('✅ Pagos parseados:', pagos)),
      catchError(error => {
        console.error('❌ Error en getPagos:', error);
        console.log('🔄 Intentando con GET...');
        
        // Opción 2: Fallback a GET si POST falla
        return this.http.get(this.apiUrl, {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${this.auth.getToken()}`,
            'Accept': 'application/xml, application/json'
          }),
          params: { estado: estado || '', busqueda: busqueda || '' },
          responseType: 'text' as 'json'
        }).pipe(
          map((res: any) => this.parseResponse(res)),
          catchError(getError => {
            console.error('❌ También falló GET:', getError);
            throw getError;
          })
        );
      })
    );
  }

  /**
   * Obtiene un pago por ID
   */
  getPagoPorId(id: number): Observable<Pago> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      ...this.getHeaders(),
      responseType: 'text' as 'json'
    }).pipe(
      map((res: any) => {
        const parsed = this.parseResponse(res);
        return parsed.length > 0 ? parsed[0] : null as any;
      }),
      catchError(error => {
        console.error('❌ Error en getPagoPorId:', error);
        throw error;
      })
    );
  }

  /**
   * Crea un nuevo pago
   */
  crearPago(pago: Pago): Observable<any> {
    const body = {
      IdProveedor: pago.idProveedor,
      Monto: pago.monto,
      Fecha: pago.fecha,
      Estado: pago.estado || 'Pendiente',
      Concepto: pago.concepto,
      MetodoPago: pago.metodoPago || '',
      NumeroTransaccion: pago.numeroTransaccion || '',
      Transaccion: 'INSERTAR'
    };
    
    return this.http.post(this.apiUrl, body, this.getHeaders()).pipe(
      tap(res => console.log('✅ Pago creado:', res)),
      catchError(error => {
        console.error('❌ Error creando pago:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza un pago existente
   */
  actualizarPago(pago: Pago): Observable<any> {
    const body = {
      IdPago: pago.idPago,
      IdProveedor: pago.idProveedor,
      Monto: pago.monto,
      Fecha: pago.fecha,
      Estado: pago.estado,
      Concepto: pago.concepto,
      MetodoPago: pago.metodoPago || '',
      NumeroTransaccion: pago.numeroTransaccion || '',
      Transaccion: 'ACTUALIZAR'
    };
    
    return this.http.put(this.apiUrl, body, this.getHeaders()).pipe(
      tap(res => console.log('✅ Pago actualizado:', res)),
      catchError(error => {
        console.error('❌ Error actualizando pago:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un pago
   */
  eliminarPago(id: number): Observable<any> {
    const body = {
      IdPago: id,
      Transaccion: 'ELIMINAR'
    };
    
    return this.http.post(this.apiUrl, body, this.getHeaders()).pipe(
      tap(res => console.log('✅ Pago eliminado:', res)),
      catchError(error => {
        console.error('❌ Error eliminando pago:', error);
        // Fallback a DELETE si POST falla
        return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
      })
    );
  }

  /**
   * Marca un pago como pagado
   */
  marcarComoPagado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/marcar-pagado`, null, this.getHeaders()).pipe(
      tap(res => console.log('✅ Pago marcado como pagado:', res)),
      catchError(error => {
        console.error('❌ Error marcando como pagado:', error);
        throw error;
      })
    );
  }

  /**
   * Parsea la respuesta XML o JSON
   */
  private parseResponse(res: any): Pago[] {
    if (!res) {
      console.log('⚠️ Respuesta vacía');
      return [];
    }

    try {
      // Si es string
      if (typeof res === 'string') {
        const text = res.trim();
        
        // Ver si es XML
        if (text.startsWith('<?xml') || text.startsWith('<')) {
          console.log('📄 Parseando XML...');
          return this.parseXml(text);
        } 
        // Ver si es JSON
        else if (text.startsWith('[') || text.startsWith('{')) {
          console.log('📄 Parseando JSON...');
          const parsed = JSON.parse(text);
          return this.extractPagos(parsed);
        }
      }
      
      // Si ya es objeto
      return this.extractPagos(res);
      
    } catch (error) {
      console.error('❌ Error parseando respuesta:', error, 'Respuesta:', res?.substring?.(0, 200) || res);
      return [];
    }
  }

  /**
   * Parsea XML
   */
  private parseXml(xmlText: string): Pago[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Verificar errores
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        console.error('❌ Error en XML:', xmlDoc.getElementsByTagName('parsererror')[0]?.textContent);
        return [];
      }
      
      // Buscar DataSet o NewDataSet
      let dataSet = xmlDoc.getElementsByTagName('NewDataSet')[0] || 
                    xmlDoc.getElementsByTagName('DataSet')[0] ||
                    xmlDoc;
      
      // Buscar tablas o elementos Pago
      const tables = dataSet.getElementsByTagName('Table');
      const pagos: Pago[] = [];
      
      // Si hay elementos Table
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const pago = this.xmlElementToPago(table);
        if (pago) pagos.push(pago);
      }
      
      // Si no hay tables, buscar directamente Pago
      if (pagos.length === 0) {
        const pagoElements = dataSet.getElementsByTagName('Pago');
        for (let i = 0; i < pagoElements.length; i++) {
          const pago = this.xmlElementToPago(pagoElements[i]);
          if (pago) pagos.push(pago);
        }
      }
      
      console.log(`✅ ${pagos.length} pagos extraídos del XML`);
      return pagos;
      
    } catch (error) {
      console.error('❌ Error parseando XML:', error);
      return [];
    }
  }

  /**
   * Convierte elemento XML a Pago
   */
  private xmlElementToPago(element: Element): Pago | null {
    try {
      const getValue = (tag: string): string => {
        const el = element.getElementsByTagName(tag)[0];
        return el ? el.textContent || '' : '';
      };
      
      return {
        idPago: parseInt(getValue('IdPago')) || undefined,
        idProveedor: parseInt(getValue('IdProveedor')) || 0,
        monto: parseFloat(getValue('Monto')) || 0,
        fecha: getValue('Fecha'),
        estado: getValue('Estado') || 'Pendiente',
        concepto: getValue('Concepto') || '',
        metodoPago: getValue('MetodoPago') || '',
        numeroTransaccion: getValue('NumeroTransaccion') || ''
      };
    } catch (error) {
      console.error('❌ Error convirtiendo XML a Pago:', error);
      return null;
    }
  }

  /**
   * Extrae pagos de objeto JSON
   */
  private extractPagos(obj: any): Pago[] {
    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizePago(item)).filter((p): p is Pago => p !== null);
    }
    
    // Buscar arrays dentro del objeto
    const keys = Object.keys(obj || {});
    for (const key of keys) {
      if (Array.isArray(obj[key])) {
        return obj[key].map((item: any) => this.normalizePago(item)).filter((p: any): p is Pago => p !== null);
      }
    }
    
    // Si es un solo objeto
    const single = this.normalizePago(obj);
    return single ? [single] : [];
  }

  /**
   * Normaliza objeto pago
   */
  private normalizePago(pago: any): Pago | null {
    if (!pago) return null;
    
    try {
      return {
        idPago: pago.idPago || pago.IdPago || pago.id || undefined,
        idProveedor: pago.idProveedor || pago.IdProveedor || 0,
        monto: pago.monto || pago.Monto || 0,
        fecha: pago.fecha || pago.Fecha || '',
        estado: pago.estado || pago.Estado || 'Pendiente',
        concepto: pago.concepto || pago.Concepto || '',
        metodoPago: pago.metodoPago || pago.MetodoPago || '',
        numeroTransaccion: pago.numeroTransaccion || pago.NumeroTransaccion || ''
      };
    } catch (error) {
      console.error('❌ Error normalizando pago:', pago, error);
      return null;
    }
  }

  /**
   * Calcula resumen local de pagos (total pagado, pendiente, vencido, total)
   */
  getResumenPagos(): Observable<ResumenPagos> {
    return this.getPagos().pipe(
      map(pagos => {
        const totalPagado = pagos.filter(p => (p.estado || '').toLowerCase().includes('pagado')).reduce((s, p) => s + p.monto, 0);
        const pendiente = pagos.filter(p => (p.estado || '').toLowerCase().includes('pendiente')).reduce((s, p) => s + p.monto, 0);
        const vencido = pagos.filter(p => (p.estado || '').toLowerCase().includes('vencido')).reduce((s, p) => s + p.monto, 0);
        const total = pagos.reduce((s, p) => s + p.monto, 0);
        return { totalPagado, pendiente, vencido, total } as ResumenPagos;
      })
    );
  }
}