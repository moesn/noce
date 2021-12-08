import {Component, OnInit} from '@angular/core';
import {NcEventService} from 'noce/core';

@Component({
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.less']
})
export class ProbeComponent implements OnInit {
  edit = '';

  constructor(private event: NcEventService) {
    this.event.on('SEARCH').subscribe(keyword => {
      alert(keyword);
    })
  }

  ngOnInit(): void {
  }

}
