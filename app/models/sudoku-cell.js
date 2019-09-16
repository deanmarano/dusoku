import { computed }  from '@ember/object';
import DS from 'ember-data';
const { Model, belongsTo } = DS;

export default class extends Model {
  hints = [];
  puzzle = belongsTo('puzzle', {asnyc: true, autoSave: true});

  init({row, column, value, given}) {
    this.row = row;
    this.column = column;
    this.value = value;
    this.given = given;
  }

}
