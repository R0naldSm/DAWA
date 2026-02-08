import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/Dashboard';

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  }

  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    }).pipe(
      map(xml => this.parsearEstadisticasXml(xml))
    );
  }

  obtenerPedidosRecientes(cantidad: number = 10): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/pedidos-recientes?cantidad=${cantidad}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    }).pipe(
      map(xml => this.parsearPedidosXml(xml))
    );
  }

  obtenerProductosPopulares(cantidad: number = 5): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/productos-populares?cantidad=${cantidad}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    }).pipe(
      map(xml => this.parsearProductosXml(xml))
    );
  }

  obtenerVentasMensuales(cantidadMeses: number = 6): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/ventas-mensuales?cantidadMeses=${cantidadMeses}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`
      }),
      responseType: 'text'
    }).pipe(
      map(xml => this.parsearVentasXml(xml))
    );
  }

  private parsearEstadisticasXml(xmlString: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    return {
      totalProveedores: parseInt(this.getXmlValue(xmlDoc, 'TotalProveedores') || '0'),
      totalProductos: parseInt(this.getXmlValue(xmlDoc, 'TotalProductos') || '0'),
      pedidosPendientes: parseInt(this.getXmlValue(xmlDoc, 'PedidosPendientes') || '0'),
      ventasMesActual: parseFloat(this.getXmlValue(xmlDoc, 'VentasMesActual') || '0'),
      entregasCompletadas: parseInt(this.getXmlValue(xmlDoc, 'EntregasCompletadas') || '0'),
      pagosPendientes: parseFloat(this.getXmlValue(xmlDoc, 'PagosPendientes') || '0')
    };
  }

  private parsearPedidosXml(xmlString: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const pedidosNodes = xmlDoc.getElementsByTagName('Pedido');
    const pedidos: any[] = [];

    for (let i = 0; i < pedidosNodes.length; i++) {
      const pedidoNode = pedidosNodes[i];
      pedidos.push({
        id: parseInt(this.getXmlValue(pedidoNode, 'IdPedido') || '0'),
        producto: this.getXmlValue(pedidoNode, 'Producto'),
        proveedor: this.getXmlValue(pedidoNode, 'Proveedor'),
        estado: this.getXmlValue(pedidoNode, 'Estado'),
        fecha: this.getXmlValue(pedidoNode, 'Fecha')
      });
    }

    return pedidos;
  }

  private parsearProductosXml(xmlString: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const productosNodes = xmlDoc.getElementsByTagName('Producto');
    const productos: any[] = [];
    const colores = ['success', 'primary', 'warning', 'info', 'secondary'];

    for (let i = 0; i < productosNodes.length; i++) {
      const productoNode = productosNodes[i];
      productos.push({
        nombre: this.getXmlValue(productoNode, 'Nombre'),
        cantidad: parseInt(this.getXmlValue(productoNode, 'CantidadVendida') || '0'),
        color: colores[i % colores.length]
      });
    }

    return productos;
  }

  private parsearVentasXml(xmlString: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const ventasNodes = xmlDoc.getElementsByTagName('Venta');
    const ventas: any[] = [];

    for (let i = 0; i < ventasNodes.length; i++) {
      const ventaNode = ventasNodes[i];
      ventas.push({
        mes: this.getXmlValue(ventaNode, 'MesNombre'),
        ventas: parseFloat(this.getXmlValue(ventaNode, 'MontoTotal') || '0')
      });
    }

    return ventas.reverse();
  }

  private getXmlValue(parent: any, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  }
}