import {Pipe, PipeTransform} from '@angular/core';
import {format} from 'date-fns';

@Pipe({name: 'datetime'})
export class DateTimePipe implements PipeTransform {
  transform(input: string): string {
    return format(new Date(input), 'yyyy-MM-dd HH:mm:ss');
  }
}

@Pipe({name: 'dateonly'})
export class DateOnlyPipe implements PipeTransform {
  transform(input: string): string {
    return format(new Date(input), 'yyyy-MM-dd');
  }
}

@Pipe({name: 'timeonly'})
export class TimeOnlyPipe implements PipeTransform {
  transform(input: string): string {
    return format(new Date(input), 'hh:mm:ss');
  }
}
