import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, hasMany } = DS;
import { all } from 'rsvp';

export default Model.extend({
  startedAt: attr('date'),
  lastPlayedAt: attr('date'),
  secondsPlayed: attr('number'),
  completedAt: attr('date'),
  solution: attr('string'),
  givens: attr('string'),
  cells: hasMany('sudoku-cell'), // an array of cells, with each cell containing a list of actions

  correct: computed("cells.@each", function() {
    return this.cells.every(cell => cell.correct);
  }),

  start: async function() {
    if(!this.startedAt) {
      let cells = [];
      for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
          let index = i * 9 + j;
          let cell = this.store.createRecord('sudoku-cell');
          cell.setProperties({
            puzzle: this,
            row: i,
            column: j,
            value: parseInt(this.solution[index], 10),
            given: this.givens[index] !== "0"
          });
          cells.push(cell.save());
        }
      }
      await all(cells);
      this.set('startedAt', new Date);
    }
    this.set('lastPlayedAt', new Date);
    this.save();
  },

  complete() {
    if(!this.correct) {
      throw new Error("can't complete incorrect puzzle");
    }
    this.set('completedAt', new Date);
    this.save();
  }
});
