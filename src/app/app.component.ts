import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { GridApi, GridReadyEvent } from "ag-grid-community";
import * as _ from "lodash";
import { Row } from "./interfaces/Row";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //declare all possible list of options for each
  allPossibleAList: string[] = [];
  allPossibleBList: string[] = [];
  allPossibleCList: string[] = [];

  //declare all initial list of options for each
  itemListA: string[] = [];
  itemListB: string[] = [];
  itemListC: string[] = [];

  //declare gridApi
  agGridApi!: GridApi;

  //declare column structure
  colDef = [
    {
      field: 'A',
      flex: 1,
      filter: true,
      suppressMenu: true
    },
    {
      field: 'B',
      flex: 1,
      filter: true,
      suppressMenu: true
    },
    {
      field: 'C',
      flex: 1,
      filter: true,
      suppressMenu: true
    },
  ];

  //declare row data
  rowData: Row[] = [
    {A: 'A1', B: 'B1', C: 'C1'},
    {A: 'A1', B: 'B1', C: 'C2'},
    {A: 'A1', B: 'B1', C: 'C3'},
    {A: 'A1', B: 'B2', C: 'C4'},
    {A: 'A1', B: 'B2', C: 'C5'},
    {A: 'A1', B: 'B3', C: 'C6'},
    {A: 'A2', B: 'B4', C: 'C7'},
    {A: 'A2', B: 'B5', C: 'C8'},
    {A: 'A2', B: 'B5', C: 'C9'},
    {A: 'A3', B: 'B6', C: 'C10'}
  ];

  //declare rendered rows
  renderedRowModelAfterFilter: Row[] = [];

  ngOnInit() {
    this.initialiseEverythingWithNewRowData();
  }

  //passing the gridApi
  onGridReady = (params: GridReadyEvent) => {
    this.agGridApi = params.api;
  };

  //it is called on change filter for A
  onChangeA($event: string[]) {
    this.agGridApi.getFilterInstance('A')?.setModel({
      filterType: 'set',
      values: $event
    });
    this.reBalanceFilterOptions();

  }

  //it is called on change filter for B
  onChangeB($event: string[]) {
    this.agGridApi.getFilterInstance('B')?.setModel({
      filterType: 'set',
      values: $event
    });
    this.reBalanceFilterOptions();
  }

  //it is called on change filter for C
  onChangeC($event: string[]) {
    this.agGridApi.getFilterInstance('C')?.setModel({
      filterType: 'set',
      values: $event
    });
    this.reBalanceFilterOptions();
  }

  //this method gets all the rendered rows and gets the remaining valus possible for A,B,C
  reBalanceFilterOptions() {
    this.agGridApi.onFilterChanged();

    this.renderedRowModelAfterFilter = [];
    _.map(this.agGridApi.getRenderedNodes(), (node) => {
      this.renderedRowModelAfterFilter.push(node.data);
    })
    this.itemListA = _.uniqBy(this.renderedRowModelAfterFilter, 'A').map(obj => obj.A);
    this.itemListB = _.uniqBy(this.renderedRowModelAfterFilter, 'B').map(obj => obj.B);
    this.itemListC = _.uniqBy(this.renderedRowModelAfterFilter, 'C').map(obj => obj.C);
  }

  changeData($event: any) {
    //set new rowData for agGrid and for compoennt rowData
    this.agGridApi.setRowData($event);
    this.rowData = $event;

    //full remove of the previous filters
    this.agGridApi.getFilterInstance('A')?.setModel(null)
    this.agGridApi.getFilterInstance('B')?.setModel(null)
    this.agGridApi.getFilterInstance('C')?.setModel(null)

    this.initialiseEverythingWithNewRowData();
  }

  initialiseEverythingWithNewRowData() {
    //initialise all possible filters from rowData
    this.allPossibleAList = _.uniqBy(this.rowData, 'A').map(obj => obj.A);
    this.allPossibleBList = _.uniqBy(this.rowData, 'B').map(obj => obj.B);
    this.allPossibleCList = _.uniqBy(this.rowData, 'C').map(obj => obj.C);

    //initial options should be the same as all possible
    this.itemListA = _.clone(this.allPossibleAList);
    this.itemListB = _.clone(this.allPossibleBList);
    this.itemListC = _.clone(this.allPossibleCList);

    //get the all the initial values from the grid without filtering
    this.renderedRowModelAfterFilter = _.clone(this.rowData);
  }
}
