import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

interface INcEvent {
  key: string;
  data?: any;
}

@Injectable()
export class NcEventService {
  private eventBus: Subject<INcEvent>;

  constructor() {
    this.eventBus = new Subject<INcEvent>();
  }

  public emit(key: string, data?: any): void {
    this.eventBus.next({key, data});
  }

  public on(key: string): Observable<any> {
    return this.eventBus.asObservable().pipe(
      filter((event: INcEvent) => event.key === key),
      map((event: INcEvent) => event.data)
    );
  }
}
