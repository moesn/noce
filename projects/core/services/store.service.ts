import {Injectable} from '@angular/core';

@Injectable()
export class NcStoreService {
  private nav: object = {};

  constructor() {

  }

  setNav(nav: object): void {
    this.nav = nav;
  }

  getNav(): any {
    return this.nav;
  }
}
