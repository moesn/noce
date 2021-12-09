import {Injectable} from '@angular/core';
import {CanActivateChild} from '@angular/router';
import {NcAuthService} from '.';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class NcAuthGuardSerivce implements CanActivateChild {
  constructor(private authService: NcAuthService) {
  }

  canActivateChild(): Observable<boolean> {
    if (location.hostname === 'localhost') {
      return of(true);
    }

    return this.authService.isAuthenticatedOrRefresh().pipe(switchMap(authed => {
      if (!authed) {
        this.authService.logout();
      }
      return of(authed);
    }));
  }
}

