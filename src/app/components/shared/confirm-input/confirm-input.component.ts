import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

@Component({
  selector: 'app-confirm-input',
  templateUrl: './confirm-input.component.html',
  styleUrls: ['./confirm-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfirmInputComponent),
      multi: true
    }
  ]
})
export class ConfirmInputComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  @Input()
  label: string;

  @Input()
  placeholder: string;

  @Output()
  submitEvent: EventEmitter<string> = new EventEmitter();

  @Input()
  val: string;

  @Output()
  valChange = new EventEmitter();

  valueChangeEvent(val): void {
    this.val = val;
    this.valChange.emit(val);
  }

  ngOnInit(): void {
  }
  
  submit(): void {
    this.submitEvent.emit(this.val);
  }

  // ControlValueAccessor implementation
  writeValue(value:any) {
    this.val = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn){
  }

  private propagateChange = (_:any) => {};
}
