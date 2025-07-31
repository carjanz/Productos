import { Injectable } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { Token } from '../interfaces/token.interface';
import { UtilService } from './util.service';


function getWindow (): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  TOKEN = '';
  public subjectRefreshToken: Subject<any> = new Subject();
  tokenExpirated = true;

  constructor(
    public settings: SettingsService,
    public router: Router,
    private _utilService: UtilService) {
  }

  isAuthenticate() {

    if(!this.tokenExpirated)
    {
      return true;
    }

    if(!this.nativeWindow.localStorage.getItem('token') || this.nativeWindow.localStorage.getItem('token') === '')
    {
      return false;
    }

    // todo: Poner otras validaciones
    // 1. Si se venció el token y existe el refrestoken obtener un nuevo token
    // 2. Si se venció el token y no se puede obtener un nuevo token, se debe limpiar los datos del local storage

    if(this.getToken() && this.getRefreshToken() && this.nativeWindow.localStorage.setToken && this.nativeWindow.localStorage.appAuth)
    {
      var encryptedRoles: string[] = JSON.parse(this.nativeWindow.localStorage.appAuth);
      var roles: string[] = [];

      encryptedRoles.forEach(element => {
        roles.push(this._utilService.decrypt(element))
      });

      this.setToken(JSON.parse(this.nativeWindow.localStorage.setToken));
      this.setRoles(roles);
      return true;
    }

    return false;

  }

  public setToken(_token: Token): Promise<boolean> {
    return new Promise(( resolve: (res: boolean) => void, reject: (res: boolean) => void) => {
          const res = false;
          this.settings.user.profile = _token.perfil;
          this.settings.user.name = _token.nombre;
          this.settings.user.picture = _token.imgPerfil;
          this.TOKEN = _token.token;
          this.nativeWindow.localStorage.token = _token.token;
		      this.nativeWindow.localStorage.refreshToken = _token.refreshToken;
          this.tokenExpirated = false;
          this.expirationTime(_token.timeOut);
          setTimeout(function() {
              resolve(res);
          }, 1);
      });

  }

  setRoles(_roles: string[])
  {
    this.settings.userRoles = _roles;
  }

  setTokenExpirated() {
    this.tokenExpirated = true;
  }

  getToken() {
    return (this.TOKEN === '') ? this.TOKEN = this.nativeWindow.localStorage.getItem('token') : this.TOKEN ;
  }

  getRefreshToken() {
    return this.nativeWindow.localStorage.refreshToken;
  }

  resetToken() {
    this.TOKEN = '';
    this.tokenExpirated = true;
    localStorage.clear();
  }

  cargarStatus(){
    this.nativeWindow.localStorage.statusService = "Token Invalido";
  }

  expirationTime(time: number) {
    setTimeout(() => {
      this.setTokenExpirated();
    }, time * 100);
  }

  processRefreshToken() {
    this.subjectRefreshToken.next(this.nativeWindow.localStorage.token);
  }

  get nativeWindow (): any {
    return getWindow();
  }

  /**
     * Check the authentication status
     */
   check(): Observable<boolean> {

      // Check if the user is logged in
      if (this.isAuthenticate()) {
          return of(true);
      }

      return of(false);
  }

  public logout()
  {

  }
}
