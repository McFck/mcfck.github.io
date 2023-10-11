import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DataSourceTransfer } from 'src/app/models/dataModels';

@Component({
  selector: 'table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.less']
})
export class TableListComponent<T> implements OnInit, AfterViewInit {

  constructor(public cdr: ChangeDetectorRef) { }

  dataSources: DataSourceTransfer[] = [];

  extensionPanelsMap = {
    panels: {},
    isAllExpanded: true
  }

  filterValue: Event;

  @ViewChildren("extensionPanels") 
  extensionPanels: QueryList<MatExpansionPanel>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.afterViewInitRoutine();
  }

  applyFilter(event: Event): void {
    this.filterValue = event;
  }

  updateAllValuesCheckbox(): void {
    let isAllExpanded = true;
    Object.keys(this.extensionPanelsMap.panels).forEach(key=>{
      if (!this.extensionPanelsMap.panels[key].expanded) {
        isAllExpanded = false;
      }
    });
    this.extensionPanelsMap.isAllExpanded = isAllExpanded;
  }

  afterViewInitRoutine(): void {
    this.dataSources.forEach((source, i)=>this.extensionPanelsMap.panels[source.key] = this.extensionPanels.get(i));
  }

  updateFilteredData(filteredData: T[], sourceKey: string): void {
    let episodes = 0;
    this.dataSources.find(source=>source.key === sourceKey).summary.filtered = episodes;
    this.dataSources = [...this.dataSources];
    this.updateTableVisibility(filteredData.length === 0, sourceKey);
  }

  updateTableVisibility(value: boolean, key?: string): void {
    if (key) {
      value ? 
      this.extensionPanelsMap.panels[key]?.close() : 
      this.extensionPanelsMap.panels[key]?.open();
    } else {
      value ? 
      Object.keys(this.extensionPanelsMap.panels)?.forEach(key=>this.extensionPanelsMap.panels[key]?.open()) : 
      Object.keys(this.extensionPanelsMap.panels)?.forEach(key=>this.extensionPanelsMap.panels[key]?.close());
    }
    
    this.cdr.detectChanges();
  }
}
