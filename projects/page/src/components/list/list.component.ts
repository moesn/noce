import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'nc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class NcListComponent implements OnInit {
  @Input() option: any; // 列表选项

  ngOnInit(): void {

  }

}
