import { Injectable } from '@angular/core';
import { Proveedor } from '../interfaces/proveedor';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private proveedores: Proveedor[] = [
    {
      id: 1,
      nombreEmpresa: "Tech Solutions S.A.", ruc: "1790012345001",
      personaContacto: "Carlos Paredes",
      telefono: "0991234567",
      correo: "contacto@techsolutions.com",
      zonaGeografica: "Quito"
    },
    {
      id: 2,
      nombreEmpresa: "AgroAndes Cía. Ltda.",
      ruc: "1790056789001",
      personaContacto: "María Torres",
      telefono: "0987654321",
      correo: "maria.torres@agroandes.ec",
      zonaGeografica: "Ambato"
    },
    {
      id: 3,
      nombreEmpresa: "Construec S.A.",
      ruc: "1790098765001",
      personaContacto: "Jorge Medina",
      telefono: "0961122334",
      correo: "jorge.medina@construec.com",
      zonaGeografica: "Guayaquil"
    },
    {
      id: 4,
      nombreEmpresa: "Distribuidora El Oro",
      ruc: "1290032145001",
      personaContacto: "Lucía Cedeño",
      telefono: "0973344556",
      correo: "l.cedeno@diseloro.com",
      zonaGeografica: "Machala"
    },
    {
      id: 5,
      nombreEmpresa: "Medicorps S.A.",
      ruc: "1790076543001",
      personaContacto: "Andrés Molina",
      telefono: "0999988776",
      correo: "andres.molina@medicorps.com",
      zonaGeografica: "Cuenca"
    },
    {
      id: 6,
      nombreEmpresa: "ElectroGuayas Cía. Ltda.",
      ruc: "0990023456001",
      personaContacto: "Patricia León",
      telefono: "0954433221",
      correo: "pleon@electroguayas.ec",
      zonaGeografica: "Guayaquil"
    },
    {
      id: 7,
      nombreEmpresa: "ServiPrint S.A.",
      ruc: "1790065432001",
      personaContacto: "Esteban Lema",
      telefono: "0988877665",
      correo: "e.lema@serviprint.com",
      zonaGeografica: "Quito"
    },
    {
      id: 8,
      nombreEmpresa: "AquaAndina Cía. Ltda.",
      ruc: "1090087654001",
      personaContacto: "Diana Vera",
      telefono: "0977765543",
      correo: "diana.vera@aquaandina.ec",
      zonaGeografica: "Loja"
    },
    {
      id: 9,
      nombreEmpresa: "PetroMarket S.A.",
      ruc: "1790011122001",
      personaContacto: "Miguel Andrade",
      telefono: "0995544332",
      correo: "miguel.andrade@petromarket.com",
      zonaGeografica: "Esmeraldas"
    },
    {
      id: 10,
      nombreEmpresa: "EcoTextil Cía. Ltda.",
      ruc: "1790099110001",
      personaContacto: "Gabriela Ruiz",
      telefono: "0966655544",
      correo: "g.ruiz@ecotextil.ec",
      zonaGeografica: "Ibarra"
    },
    {
      id: 11,
      nombreEmpresa: "SmartFoods S.A.",
      ruc: "1790045678001",
      personaContacto: "Héctor Montalvo",
      telefono: "0992211334",
      correo: "hector.montalvo@smartfoods.com",
      zonaGeografica: "Santo Domingo"
    },
    {
      id: 12,
      nombreEmpresa: "FerreMundo Cía. Ltda.",
      ruc: "1790034567001",
      personaContacto: "Elena López",
      telefono: "0978899001",
      correo: "elena.lopez@ferremundo.ec",
      zonaGeografica: "Riobamba"
    },
    {
      id: 13,
      nombreEmpresa: "GlobalNet S.A.",
      ruc: "1790088888001",
      personaContacto: "Daniel Cevallos",
      telefono: "0991100223",
      correo: "daniel.cevallos@globalnet.com",
      zonaGeografica: "Quito"
    },
    {
      id: 14,
      nombreEmpresa: "AgroTierra Cía. Ltda.",
      ruc: "1390022334001",
      personaContacto: "Marisol Paredes",
      telefono: "0988800991",
      correo: "marisol.paredes@agrotierra.ec",
      zonaGeografica: "Latacunga"
    },
    {
      id: 15,
      nombreEmpresa: "MegaElectrónica S.A.",
      ruc: "1790055555001",
      personaContacto: "Santiago Pérez",
      telefono: "0994433221",
      correo: "s.perez@megaelectronica.com",
      zonaGeografica: "Guayaquil"
    },
    {
      id: 16,
      nombreEmpresa: "AndesFrut Cía. Ltda.",
      ruc: "1490033333001",
      personaContacto: "Nathaly Ortiz",
      telefono: "0983344556",
      correo: "nathaly.ortiz@andesfrut.ec",
      zonaGeografica: "Loja"
    },
    {
      id: 17,
      nombreEmpresa: "PapelMax S.A.",
      ruc: "1790012344001",
      personaContacto: "Ricardo Vaca",
      telefono: "0971122334",
      correo: "ricardo.vaca@papelmax.com",
      zonaGeografica: "Cuenca"
    },
    {
      id: 18,
      nombreEmpresa: "LogisEcuador Cía. Ltda.",
      ruc: "1790077777001",
      personaContacto: "Fernanda Castillo",
      telefono: "0986677885",
      correo: "fernanda.castillo@logisecuador.ec",
      zonaGeografica: "Quito"
    },
    {
      id: 19,
      nombreEmpresa: "CompuStore S.A.",
      ruc: "1790090009001",
      personaContacto: "Iván Sánchez",
      telefono: "0999988771",
      correo: "ivan.sanchez@compustore.com",
      zonaGeografica: "Guayaquil"
    },
    {
      id: 20,
      nombreEmpresa: "BioNature Cía. Ltda.",
      ruc: "1790044444001",
      personaContacto: "Paola Herrera",
      telefono: "0961122334",
      correo: "paola.herrera@bionature.ec",
      zonaGeografica: "Ambato"
    }
  ];

  getProveedores(): Proveedor[] {
    return this.proveedores;
  }

}
