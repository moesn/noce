import {Pipe, PipeTransform} from '@angular/core';
import {byteFormat} from 'noce/helper';

@Pipe({name: 'filesize'})
export class FileSizePipe implements PipeTransform {
  transform(input: string): string {
    return byteFormat(input);
  }
}
