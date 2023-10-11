import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslatePipe } from 'src/app/components/shared/pipes/translate.pipe';
import { TranslateService } from 'src/app/services/translate.service';
import { TableData } from '../anime-stats-lists/anime-stats-lists.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BADGES_MAP } from 'src/app/constants/generalConsts';
import { NgTemplateNameDirective } from 'src/app/directives/TemplateNameDirective';
import { BaseTableComponent } from '../shared/base-table/base-table.component';

@Component({
  selector: 'app-anime-stats-table',
  templateUrl: './anime-stats-table.component.html',
  styleUrls: ['./anime-stats-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeStatsTableComponent extends BaseTableComponent<TableData> implements OnInit, AfterViewInit {
  @ViewChildren(NgTemplateNameDirective) private _templates: QueryList<NgTemplateNameDirective>;

  @Input()
  tableData: TableData[];

  @Input()
  isAnime: boolean;

  @Output()
  onFilterChanges: EventEmitter<TableData[]> = new EventEmitter();

  dataSource: MatTableDataSource<TableData>;

  defaultColumns: string[] = [
    'orderNumber',
    'thumbnail',
    'name',
    'score',
    'episodes',
    'kind'
  ];

  mobileColumns: string[] = [
    'orderNumber', 
    'name', 
    'score'
  ];

  displayedColumns: string[] = [...this.defaultColumns];

  titleFieldName = 'name';

  isSimplifiedView = false;

  constructor(
    translationService: TranslateService,
    cdr: ChangeDetectorRef,
    translatePipe: TranslatePipe,
    breakpointObserver: BreakpointObserver
  ) {
    super(cdr, translatePipe, translationService, breakpointObserver);
  }

  ngOnInit() {
    if (!this.isAnime) {
      this.defaultColumns = [
        'orderNumber',
        'thumbnail',
        'name',
        'score',
        'chapters',
        'kind',
      ];

      this.displayedColumns = [...this.defaultColumns];
    }

    this.onInitRoutine();
  }

  ngAfterViewInit(): void {
    this.tableData.forEach(el=>{
      el["badge"] = [];
      el.text?.split(", ").forEach(keyWord=>{
        let shouldDisplay = BADGES_MAP[keyWord];
        if (shouldDisplay) {
          let badgeObject = BADGES_MAP[keyWord];
          badgeObject["name"] = keyWord;
          if(badgeObject) {
            if (badgeObject.template) {
              badgeObject["templateRef"] = this.getTemplateRefByName(badgeObject.icon);
            }
            el["badge"].push(badgeObject);
          }
        }
      })
    });
    this.dataSource = new MatTableDataSource(this.tableData);
    this.afterViewInitRoutine();
    this.cdr.detectChanges();
  }

  getTemplateRefByName(name: string): TemplateRef<any> {
    const dir = this._templates.find(dir => dir.name === name);
    return dir ? dir.template : null
  }

  updateTitleFieldName(): void {
    this.titleFieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }
}
