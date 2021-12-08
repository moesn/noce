import {Component, OnDestroy, OnInit} from '@angular/core';
import {NcEventService} from 'noce/core';

@Component({
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.less']
})
export class ProbeComponent implements OnInit, OnDestroy {
  edit = '';
  searchEvent: any; // 搜索事件

  constructor(private event: NcEventService) {
    // 订阅搜索事件
    this.searchEvent = this.event.on('SEARCH').subscribe(keyword => {
      alert(keyword);
    })
  }

  ngOnDestroy(): void {
    // 取消订阅搜索事件
    this.searchEvent.unsubscribe();
  }

  ngOnInit(): void {
  }

}
