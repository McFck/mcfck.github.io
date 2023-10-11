import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CompareUsers } from 'src/app/models/dataModels';
import { CompareData } from '../compare-table/compare-table.component';
import { TableListComponent } from '../../shared/table-list/table-list.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'compare-lists',
  templateUrl: './compare-lists.component.html',
  styleUrls: ['./compare-lists.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CompareListsComponent extends TableListComponent<CompareData> implements OnInit, AfterViewInit {

  constructor(cdr: ChangeDetectorRef, private translatePipe: TranslatePipe) { 
    super(cdr);
  }

  @Input() data: CompareUsers;
  @Input() type: string = 'anime';

  singleTableFields = [
    'orderNumber',
    'title'
  ];

  listsConfiguration = {
    left: {
      data: [],
      fields: {
        mobile: [...this.singleTableFields, 'scoreLeft'],
        desktop: [...this.singleTableFields, 'scoreLeft']
      },
      sortKey: 'scoreLeft',
      title: 'left'
    },
    right: {
      data: [],
      fields: {
        mobile: [...this.singleTableFields, 'scoreRight'],
        desktop: [...this.singleTableFields, 'scoreRight']
      },
      sortKey: 'scoreRight',
      title: 'right'
    },
    both: {
      fields: {
        mobile: [
          'orderNumber',
          'title',
          'scoreLeft',
          'scoreRight',
          'diff'
        ],
        desktop: [
          'orderNumber',
          'title',
          'scoreLeft',
          'scoreRight',
          'diff'
        ]
      },
      sortKey: 'diff',
      data:[]
    },
    userNames: ['left', 'right']
  }
  
  keysArr = ['both','left','right'];
  
  ngOnInit(): void {
    this.listsConfiguration.left.title = this.data.left.nickname;
    this.listsConfiguration.right.title = this.data.right.nickname;
    this.listsConfiguration.userNames[0] = this.data.left.nickname;
    this.listsConfiguration.userNames[1] = this.data.right.nickname;
  }

  ngAfterViewInit(): void {
    this.keysArr.forEach((key, i)=>this.extensionPanelsMap.panels[key] = this.extensionPanels.get(i));
  }

  updateFilteredData(filteredData: CompareData[], sourceKey: string): void {
    this.updateTableVisibility(filteredData.length === 0, sourceKey);
    this.listsConfiguration[sourceKey].data = filteredData;
    this.cdr.detectChanges();
  }
}
