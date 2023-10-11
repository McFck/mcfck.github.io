import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { CompareUsers, CompareEntries } from 'src/app/models/dataModels';
import { TranslateService } from 'src/app/services/translate.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseTableComponent } from '../../shared/base-table/base-table.component';

export interface CompareData {
  title: string;
  titleRussian: string,
  url: string;
  malUrl: string;
  scoreLeft: number;
  scoreRight: number;
  diff: number;
  statusLeft: string;
  statusRight: string;
  color: string
}

@Component({
  selector: 'compare-table',
  templateUrl: './compare-table.component.html',
  styleUrls: ['./compare-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareTableComponent extends BaseTableComponent<CompareData> implements OnInit, AfterViewInit {

  constructor(
    translationService: TranslateService,
    translatePipe: TranslatePipe,
    cdr: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver) { 
      super(cdr, translatePipe, translationService, breakpointObserver)
    }

  @Input() data: CompareUsers;
  @Input() type: string = 'anime';
  @Input() userKey: string = 'both'
  @Input() sortKey: string = 'diff'

  @Input()
  defaultColumns: string[] = [
    'orderNumber',
    'title',
    'scoreLeft',
    'scoreRight',
    'diff'
  ];

  @Input()
  mobileColumns: string[] = [
    'orderNumber',
    'title',
    'scoreLeft',
    'scoreRight',
    'diff'
  ];

  @Input()
  userNames: string[];

  @Output()
  onFilterChanges: EventEmitter<CompareData[]> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  
  dataSource: MatTableDataSource<CompareData>;

  calculatedMeans = {
    scoreLeft: '0.0',
    scoreRight: '0.0',
    diff: '0.0'
  }

  displayedColumns: string[] = [...this.defaultColumns];

  titleFieldName = 'title';

  ngOnInit(): void {
    this.mapTableData(this.data);

    this.onInitRoutine();
  }

  getMappedDifferenceObj(input: CompareUsers): CompareEntries {
    const result = {
      left: [],
      right: [],
      common: {
        left: [],
        right: [],
        obj: []
      }
    };

    const leftMap = new Map();
    const rightMap = new Map();

    input['left'].userData[this.type].forEach(entry=>{
      leftMap.set(entry[this.type].id, entry);
    });

    input['right'].userData[this.type].forEach(entry=>{
      rightMap.set(entry[this.type].id, entry);
    });

    input['right'].userData[this.type].forEach(entry=>{
      if(leftMap.has(entry[this.type].id)) {
        result.common.left.push(leftMap.get(entry[this.type].id));
        result.common.right.push(entry);
        result.common.obj.push(entry[this.type]);
      } else {
        result.right.push(entry);
      }
    });

    leftMap.forEach(entry=>{
      if(!rightMap.has(entry[this.type].id)) {
        result.left.push(entry);
      }
    })

    return result;
  }

  calculateDiff(left, right): number {
    if (left.score === 0) {
      return left.status === "dropped" ? right.score : null;
    }

    if (right.score === 0) {
      return right.status === "dropped" ? left.score : null;
    }

    return Math.abs(left.score - right.score);
  }

  getRowColor(diff: number): string {
    if (diff==null) return null;
    if (diff < 2) return '#22ff339e';
    if (diff < 3) return '#84ff8d9e';
    if (diff < 6) return '#ff55559e';
    if (diff < 8) return '#fd24249e';
    return '#ff00009e';
  }

  calculateMean(key: string): void {
    let total = 0;
    let amount = 0;
    this.dataSource?.data.forEach(entry=>{
      if(GeneralHelper.isNumeric(entry[key])) {
        amount++;
        total += entry[key];
      } 
    })
    total/=amount||1;
    this.calculatedMeans[key] = total.toPrecision(2);
  }

  mapTableData(input: CompareUsers): void {
    const mappedData = [];
    const bothWays = this.getMappedDifferenceObj(input);
    if (this.userKey === 'both') {
      for(let i = 0; i < bothWays.common.obj.length; i++) {
          const mappedEntry: CompareData = {} as any;
          mappedEntry.title = bothWays.common.obj[i].name;
          mappedEntry.titleRussian = bothWays.common.obj[i].russian;
          mappedEntry.url = bothWays.common.obj[i].url; 
          mappedEntry.malUrl = bothWays.common.obj[i].url; //TODO: CHANGE
          mappedEntry.scoreLeft = bothWays.common.left[i].score;
          mappedEntry.scoreRight = bothWays.common.right[i].score;
          mappedEntry.diff = this.calculateDiff(bothWays.common.left[i], bothWays.common.right[i]);
          mappedEntry.statusLeft = bothWays.common.left[i].status;
          mappedEntry.statusRight = bothWays.common.right[i].status;
          mappedEntry.color = this.getRowColor(mappedEntry.diff);
          mappedData.push(mappedEntry);
      }
    
      this.dataSource = new MatTableDataSource(mappedData);
      this.calculateMean('scoreLeft');
      this.calculateMean('scoreRight');
      this.calculateMean('diff');
    } else {
      bothWays[this.userKey]?.filter(entry=>entry.score > 0)?.forEach(entry=>{
        const mappedEntry: CompareData = {} as any;
        mappedEntry.title = entry[this.type].name;
        mappedEntry.titleRussian = entry[this.type].russian;
        mappedEntry.url = entry[this.type].url; 
        mappedEntry.malUrl = entry[this.type].url; //TODO: CHANGE
        mappedEntry[`score${GeneralHelper.capitalizeFirstLetter(this.userKey)}`] = entry.score;
        mappedData.push(mappedEntry);
      });
      this.dataSource = new MatTableDataSource(mappedData);
    }
    
    this.updateTitleFieldName();
    this.dataSource.sort = this.sort;
  }

  updateTitleFieldName(): void {
    this.titleFieldName = this.translationService.getLanguage() === 'ru' ? 'titleRussian' : 'title';
  }
}
