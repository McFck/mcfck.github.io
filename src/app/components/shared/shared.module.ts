import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmInputComponent } from './confirm-input/confirm-input.component';
import { TranslatePipe } from 'src/app/components/shared/pipes/translate.pipe';
import { LanguageContentPipe } from 'src/app/components/shared/pipes/languageContent.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DateAgoPipe } from './pipes/dateAgo.pipe';
import { FormsModule } from '@angular/forms';
import { ToolTipTextComponent } from './tool-tip-text/tool-tip-text.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseTableComponent } from './base-table/base-table.component';
import { TableListComponent } from './table-list/table-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  declarations: [
    ConfirmInputComponent,
    TranslatePipe,
    DateAgoPipe,
    LanguageContentPipe,
    ToolTipTextComponent,
    BaseTableComponent,
    TableListComponent
  ],
  exports: [
    ConfirmInputComponent,
    ToolTipTextComponent,
    TranslatePipe,
    DateAgoPipe,
    LanguageContentPipe
  ],
  providers: [
    TranslatePipe,
    DateAgoPipe,
    LanguageContentPipe
  ]
})
export class SharedModule {}