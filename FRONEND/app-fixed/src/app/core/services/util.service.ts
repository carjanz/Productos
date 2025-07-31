import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private readonly salt = environment.ENCRYPTION_SALT;

  /**
   * Encripta texto con salt desde environment
   */
  encrypt(plainText: string): string {
    return CryptoJS.AES.encrypt(plainText, this.salt).toString();
  }

  /**
   * Desencripta texto con salt desde environment
   */
  decrypt(encryptedText: string): string {
    return CryptoJS.AES.decrypt(encryptedText, this.salt).toString(CryptoJS.enc.Utf8);
  }
}
