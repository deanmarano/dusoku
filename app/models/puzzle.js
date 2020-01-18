import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, hasMany } = DS;
import { all } from 'rsvp';
import { makepuzzle, solvepuzzle } from "sudoku";

export function puzzleToString(puzzle) {
  let retval = "";
  puzzle.forEach((cell, index)=> {
    if(cell == null) {
      puzzle[index] = '0';
    }
  });
  for(let i = 0; i < 9; i++) {
    retval+= puzzle.slice(i * 9, (i * 9) + 9).join('');
  }
  return retval;
}

export function puzzleStringToId(puzzleString) {
  return puzzleString.
    replace(/000000/g, 'a').
    replace(/00000/g, 'b').
    replace(/0000/g, 'c').
    replace(/000/g, 'd').
    replace(/00/g, 'e');
}

function puzzleToId(puzzle) {
  return puzzleStringToId(puzzleToString(puzzle));
}

export default Model.extend({
  startedAt: attr('date'),
  lastPlayedAt: attr('date'),
  secondsPlayed: attr('number', {defaultValue: 0}),
  completedAt: attr('date'),
  solution: attr('string'),
  givens: attr('string'),
  cells: hasMany('sudoku-cell', {async: true, dependent: 'destroy'}), // an array of cells, with each cell containing a list of actions

  init() {
    if(!this.givens) {
      let generatedPuzzle = makepuzzle();
      let solution = solvepuzzle(generatedPuzzle);
      this.id = puzzleToId(generatedPuzzle);
      this.setProperties({
        givens: this.id,
        solution: puzzleToString(solution)
      });
    }
  },

  correct: computed("cells.@each.correct", function() {
    return this.cells.every(cell => cell.correct);
  }),


  start: async function() {
    if(!this.startedAt && this.get('cells.length') === 0) {
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
