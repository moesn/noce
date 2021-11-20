import {Injectable} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Injectable()
export class NcNotifyService {
  constructor(private notify: NzNotificationService) {
  }

  info(msg: string, duration?: number): void {
    this.notify.blank(msg, '', {
      nzClass: 'ant-bg-info',
      nzDuration: !!duration ? duration : 3000
    });
  }

  success(msg: string, duration?: number): void {
    this.notify.blank(msg, '', {
      nzClass: 'ant-bg-success',
      nzDuration: !!duration ? duration : 3000
    });
  }

  warning(msg: string, duration?: number): void {
    this.notify.blank(msg, '', {
      nzClass: 'ant-bg-warning',
      nzDuration: !!duration ? duration : 3000
    });
  }

  error(msg: string, duration?: number): void {
    this.notify.blank(msg, '', {
      nzClass: 'ant-bg-error',
      nzDuration: !!duration ? duration : 3000
    });
  }
}
