import { computed }  from '@ember/object';

export default class SudokuCell {
  hints = [];

  constructor({row, column, value, given}) {
    this.row = row;
    this.column = column;
    this.value = value;
    this.given = given;
  }

  @computed('given', 'guess')
  get displayValue() {
    if(this.given) {
      return this.value;
    } else {
      return this.guess;
    }
  }
}
