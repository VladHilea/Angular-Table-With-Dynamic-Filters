import { Component, EventEmitter, inject, Output } from '@angular/core';
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Row } from "../../interfaces/Row"

@Component({
  selector: 'app-row-data-generator',
  templateUrl: './row-data-generator.component.html',
  styleUrls: ['./row-data-generator.component.scss']
})
export class RowDataGeneratorComponent {

  toastr = inject(ToastrService);
  @Output() onNewRowData: EventEmitter<any> = new EventEmitter();
  showGenerate: boolean = false;
  textInput: string = 'A1,B1,C1\n' +
    'A1,B1,C2\n' +
    'A1,B1,C3\n' +
    'A1,B2,C4\n' +
    'A1,B2,C5\n' +
    'A1,B3,C6\n' +
    'A2,B4,C7\n' +
    'A2,B5,C8\n' +
    'A2,B5,C9\n' +
    'A3,B6,C10';

  toggleGenerateTextarea() {
    this.showGenerate = !this.showGenerate;
  }

  hideGenerateTextarea() {
    this.showGenerate = false;
  }

  handleParsingText() {
    let hasProblem = false;
    let parsedData = _.map(this.textInput.split('\n'), (line, index) => {

      if (_.isEmpty(line)) {
        this.toastr.error(`Line ${index + 1} is empty`, 'Format Error');
        hasProblem = true;
        return;
      }

      const values = line.split(',').map((value) => value.trim());

      if (values.length !== 3) {
        this.toastr.error(`Line ${index + 1} has ${values.length} entries instead of 3`, 'Format Error');
        hasProblem = true;
        return;
      }

      const [A, B, C] = values;
      return {A, B, C};

    }).filter(Boolean);

    if (hasProblem) {
      return;
    }

    this.onNewRowData.emit(parsedData);
    this.hideGenerateTextarea();
  }
}
