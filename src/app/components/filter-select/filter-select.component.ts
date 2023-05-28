import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash'

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent {

  @Input() placeholder!: string;
  @Input() itemList!: string[];
  @Input() allPossibleItemList!: string[];
  @Output() onChangeFilter: EventEmitter<string[]> = new EventEmitter<string[]>();
  selectedItem?: string;
  previousSingle = false;

  //it is called when an option is selected from the selector
  onFilterChange() {
    //when you remove filter/select 'Toate' it emits all the possible values
    if (_.isEmpty(this.selectedItem) || this.selectedItem === 'Toate') {
      this.onChangeFilter.emit(this.allPossibleItemList);
      return;
    }

    //emis the selected value
    this.onChangeFilter.emit(_.castArray(this.selectedItem));
  }

  ngOnChanges() {
    //adds the value 'Toate' if it has all the options available
    if (this.itemList?.length === this.allPossibleItemList?.length) {
      this.itemList.unshift('Toate');
    }

    //auto select the only possible filter if it is only one available
    if (this.itemList.length === 1) {
      this.selectedItem = this.itemList[0];
      this.previousSingle = true;
    }

    //if the previous filter made this one to be auto-selected, and the current filter allows this filter to have
    //multiple options, it unselects the previous auto-selected one
    if (this.itemList.length !==1 && this.previousSingle){
      this.selectedItem = undefined;
      this.previousSingle = false;
    }
  }
}
