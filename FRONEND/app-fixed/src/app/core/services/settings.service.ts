import { Injectable } from '@angular/core';
import { Message } from '../models/Message';
import { Subject } from 'rxjs';
import  moment from 'moment';
import { Rol } from '../interfaces/rol.interface';
import { Roles } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public user: any;
  public app: any;
  public layout: any;
  public loading: any;
  public currentModule: any;
  public userRoles: string[] = [];

  public lastMessage = '';

  isTimeWait = false;

  subShowLoading: Subject<boolean> = new Subject();
  subShowLoadingRequest: Subject<boolean> = new Subject();
  subShowMessage: Subject<Message> = new Subject();

  public HOY!: Date;

  constructor() {
    var hoy = moment().format('MM-DD-YYYY');

    this.HOY = this.string2Date(hoy);
    this.HOY.setHours(0, 0, 0, 0);

    // User Settings
    // -----------------------------------
    this.user = {
      profile: '',
      name: 'Rafael P',
      job: 'ng-developer',
      picture: 'assets/img/user/02.jpg',
    };

    // App Settings
    // -----------------------------------
    this.app = {
      name: 'ROMA',
      description: 'Sistema de información de Roma Finanzas',
      year: new Date().getFullYear(),
    };

    // Layout Settings
    // -----------------------------------
    this.layout = {
      isFixed: true,
      isCollapsed: false,
      isBoxed: false,
      isRTL: false,
      horizontal: false,
      isFloat: false,
      asideHover: false,
      theme: null,
      asideScrollbar: false,
      isCollapsedText: false,
      useFullLayout: false,
      hiddenFooter: false,
      offsidebarOpen: false,
      asideToggled: false,
      viewAnimation: 'ng-fadeInUp',
      toggleUserBlock: false,
    };

    this.loading = {
      loadingPage: false,
      updatingToken: false,
    };
  }

  showLoading(flat: any) {
    this.subShowLoading.next(flat);
  }

  showLoadingRequest(flat2: any) {
    this.subShowLoadingRequest.next(flat2);
  }

  getAppSetting(name: string) {
    return name ? this.app[name] : this.app;
  }

  getUserSetting(name: string | number) {
    return name ? this.user[name] : this.user;
  }

  getLayoutSetting(name: string | number) {
    return name ? this.layout[name] : this.layout;
  }

  setAppSetting(name: string | number, value: any) {
    if (typeof this.app[name] !== 'undefined') {
      this.app[name] = value;
    }
  }

  setUserSetting(name: string | number, value: any) {
    if (typeof this.user[name] !== 'undefined') {
      this.user[name] = value;
    }
  }

  setLayoutSetting(name: string | number, value: boolean) {
    if (typeof this.layout[name] !== 'undefined') {
      return (this.layout[name] = value);
    } else {
      return this.layout[name];
    }
  }

  toggleLayoutSetting(name: any) {
    return this.setLayoutSetting(name, !this.getLayoutSetting(name));
  }

  date2Time(fecha: Date): string {
    let date = new Date(fecha);
    let localOffset = date.getTimezoneOffset() * 60000;
    let utc = date.getTime(); // + localOffset ;

    return utc.toString();
  }

  // convierte fecha a timestamp
  string2Date(_date: string | number | Date): Date {
    let date = new Date(_date);

    return date;
  }

  // convierte timestamp a fecha string
  public timestam2String(_date: string) {
    let date = new Date(+_date);
    return date;
  }

  // convierte timestamp a fecha string
  public timestam2Date(_date: any): Date {
    let datep = new Date(+_date);
    let fecha = datep.toISOString().split('T')[0];
    let date = new Date(+datep);
    return date;
  }

  // convierte fecha a timestamp
  public string2Timestam(_date: string): number {
    let date = new Date(_date);
    let localOffset = date.getTimezoneOffset() * 60000;
    let utc = date.getTime() + localOffset;

    return utc;
  }

  // Funciòn para obtener el primer objeto de un arreglo
  findObject(datos: any[], funcionLogica: any) {
    var objeto;

    if (datos && datos.length) {
      objeto = datos.filter(funcionLogica);
      objeto = objeto ? objeto[0] : objeto;
    }

    return objeto;
  } // end function


  // Funciones asociadas a determinar si un usuario corresponde a un rol especifico

  tieneRol(rol:string):boolean
  {
    return this.userRoles.includes(rol, 0);
  }


  esAdministrador()
  {
    return this.tieneRol(Roles.AdministradorSistema);
  }

  esContador()
  {
    return this.tieneRol(Roles.Contador);
  }

  esIngeniero()
  {
    return this.tieneRol(Roles.Ingeniero);
  }

  esSoporteAnh()
  {
    return this.tieneRol(Roles.Soporte);
  }



}
