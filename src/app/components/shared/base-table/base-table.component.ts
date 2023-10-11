import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslateService } from 'src/app/services/translate.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.less']
})
export class BaseTableComponent<T> implements OnInit, AfterViewInit {

  @Input() set filter(value: Event) {
    if (value) {
      this.applyFilter(value);
    }
  }

  @Output()
  onFilterChanges: EventEmitter<T[]> = new EventEmitter();
  
  @ViewChild(MatPaginator) 
  public paginator: MatPaginator;
  @ViewChild(MatSort) 
  public sort: MatSort;

  defaultColumns: string[];
  mobileColumns: string[];
  displayedColumns: string[];
  isSimplifiedView = false;
  
  constructor(
    public cdr: ChangeDetectorRef, 
    public translatePipe: TranslatePipe, 
    public translationService: TranslateService,
    public breakpointObserver: BreakpointObserver) { }

  dataSource: MatTableDataSource<T>;
  titleFieldName = 'name';
  
  ngOnInit(): void {
    this.onInitRoutine();
  }

  onInitRoutine(): void {
    this.translationService.localeChange.subscribe(() => {
      this.updateTitleFieldName();
      this.paginator && GeneralHelper.translatePaginator(this.paginator, this.translatePipe);
      this.dataSource?.filteredData && this.onFilterChanges.emit(this.dataSource.filteredData);
      this.cdr.markForCheck();
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        const before = this.isSimplifiedView;
        this.isSimplifiedView = result.matches;
        if (result.matches) {
          this.displayedColumns = this.mobileColumns;
        } else {
          this.displayedColumns = this.defaultColumns;
        }
        before !== this.isSimplifiedView && this.cdr.detectChanges();
      });
  }

  afterViewInitRoutine(): void {
    this.paginator && GeneralHelper.translatePaginator(this.paginator, this.translatePipe);

    if (this.dataSource) {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }
  ngAfterViewInit(): void {
    this.afterViewInitRoutine();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.onFilterChanges.emit(this.dataSource.filteredData);
    }
    
    this.cdr.detectChanges();
  }

  updateTitleFieldName(): void {
    this.titleFieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }
}
