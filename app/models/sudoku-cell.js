import { computed }  from '@ember/object';
import DS from 'ember-data';
const { Model } = DS;

export default class extends Model {
  hints = [];

  init({row, column, value, given}) {
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
