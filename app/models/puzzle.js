import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, hasMany } = DS;
import { all } from 'rsvp';

export default Model.extend({
  startedAt: attr('date'),
  lastPlayedAt: attr('date'),
  secondsPlayed: attr('number'),
  completedAt: attr('date'),
  solution: attr(),
  givens: attr(),
  cells: hasMany('sudoku-cell'), // an array of cells, with each cell containing a list of actions

  correct: computed("grid.@each", function() {
    return this.grid.every(cell => cell.correct);
  }),

  start: async function() {
    if(!this.startedAt) {
      let grid = [];
      for(let i = 0; i < 9; i++) {
        grid[i] = grid[i] || [];
        for(let j = 0; j < 9; j++) {
          let index = i * 9 + j;
          grid[i][j] = this.store.createRecord('sudoku-cell', {
            row: i,
            column: j,
            value: parseInt(this.solution[index], 10),
            given: this.givens[index] !== "0"
          });
        }
      }
      await all(grid.map(cell => cell.save()));
      this.set('cells', grid);
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
