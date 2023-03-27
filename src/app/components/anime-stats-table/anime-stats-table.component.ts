import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TranslateService } from 'src/app/services/translate.service';
import { TableData } from '../anime-stats-lists/anime-stats-lists.component';

@Component({
  selector: 'app-anime-stats-table',
  templateUrl: './anime-stats-table.component.html',
  styleUrls: ['./anime-stats-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeStatsTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input()
  tableData: TableData[];

  @Input()
  isAnime: boolean;

  @Input() set filter(value: Event) {
    if (value) {
      this.applyFilter(value);
    }
  }

  dataSource: MatTableDataSource<TableData>;

  displayedColumns: string[] = [
    'orderNumber',
    'name',
    'score',
    'episodes',
    'kind',
  ];
  historyFieldName = 'name';

  constructor(
    private translationService: TranslateService,
    private cdr: ChangeDetectorRef,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    if (!this.isAnime) {
      this.displayedColumns = [
        'orderNumber',
        'name',
        'score',
        'chapters',
        'kind',
      ];
    }
    this.translationService.localeChange.subscribe(() => {
      this.updateHistoryFieldName();
      this.translatePaginator(this.paginator);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.translatePaginator(this.paginator);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  updateHistoryFieldName(): void {
    this.historyFieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.cdr.detectChanges();
  }

  translatePaginator(paginator: MatPaginator): void {
    paginator._intl.itemsPerPageLabel =
      this.translatePipe.transform('ItemsPerPage');
    paginator._intl.nextPageLabel = this.translatePipe.transform('NextPage');
    paginator._intl.previousPageLabel =
      this.translatePipe.transform('PreviousPage');
    paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length == 0 || pageSize == 0) {
        return this.translatePipe.transform('OUT_OF', {first: 0, second: length});//`0 van ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;

      return this.translatePipe.transform('N_OUT_OF', {first: startIndex + 1, second: endIndex, third: length});//`${startIndex + 1} - ${endIndex} van ${length}`;
    };
    paginator._intl.changes.next();
  }
}