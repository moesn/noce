import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {NcAuthService} from 'noce/auth';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class NcAuthGuardSerivce implements CanActivateChild {
  constructor(private authService: NcAuthService) {
  }

  canActivateChild(): Observable<boolean> {
    return this.authService.isAuthenticatedOrRefresh().pipe(switchMap(authed => {
      if (!authed) {
        this.authService.logout();
      }
      return of(authed);
    }));
  }
}

