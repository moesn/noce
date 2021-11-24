import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

interface INcEvent {
  key: string;
  data?: any;
}

type NcEvents = 'NAV_CLICK' | 'todo';

@Injectable()
export class NcEventService {
  private eventBus: Subject<INcEvent>;

  constructor() {
    this.eventBus = new Subject<INcEvent>();
  }

  public emit(key: NcEvents, data?: any): void {
    this.eventBus.next({key, data});
  }

  public on(key: NcEvents): Observable<any> {
    return this.eventBus.asObservable().pipe(
      filter((event: INcEvent) => event.key === key),
      map((event: INcEvent) => event.data)
    );
  }
}
