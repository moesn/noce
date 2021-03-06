import {Injectable} from '@angular/core';
import JSEncrypt from 'jsencrypt';
import {getAppOption} from '../schemas/schema-to-option';
import {b64tohex} from "jsencrypt/lib/lib/jsbn/base64";

export abstract class NcCryptService {
  abstract encrypt(token: string): string;

  abstract decrypt(token: string): string;
}

@Injectable()
export class NcCryptBase64Service extends NcCryptService {
  encrypt(plain: string): string {
    return btoa(encodeURI(plain));
  }

  decrypt(cipher: string): string {
    return decodeURI(atob(cipher));
  }
}

@Injectable()
export class NcCryptRSAService extends NcCryptService {
  constructor() {
    super();
  }

  encrypt(plain: string): string {
    const pubKey = getAppOption('pubKey');
    const encrypt = new JSEncrypt({});

    encrypt.setPublicKey(pubKey);
    const encrypted = encrypt.encrypt(plain) || '';

    return getAppOption('encryptMode') === 'rsa64' ? encrypted : b64tohex(encrypted);
  }

  decrypt(cipher: string): string {
    return cipher;
  }
}
