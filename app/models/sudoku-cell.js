import { computed }  from '@ember/object';
import DS from 'ember-data';
const { attr, Model, belongsTo } = DS;

export default Model.extend({
  value: attr('number'),
  guess: attr('number'),
  given: attr('boolean'),
  hints: attr(),
  row: attr(),
  column: attr(),
  puzzle: belongsTo('puzzle', {asnyc: true, autoSave: true}),

  init() {
    this._super();
    this.set('hints', []);
  },

  displayValue: computed('given', 'guess', function() {
    if(this.given) {
      return this.value;
    } else {
      return this.guess;
    }
  }),

  index: computed('row', 'column', function() {
    return this.row * this.column;
  }),

  correct: computed('value', 'guess', function() {
    return this.given || this.value === this.guess;
  })
})
