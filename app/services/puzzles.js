import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
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

export function puzzleToId(puzzle) {
  return puzzleStringToId(puzzleToString(puzzle));
}

export default Service.extend({
  store: service(),
  init() {
    this._super(arguments);
    this.set("loaded", isEmpty(this.store.peekAll("puzzle")));
  },
  loaded: true,
  create() {
    if(!this.givens) {
      let generatedPuzzle = makepuzzle();
      let solution = solvepuzzle(generatedPuzzle);
      let puzzle = this.store.createRecord("puzzle", {
        id: puzzleToId(generatedPuzzle),
        givens: puzzleToId(generatedPuzzle),
        solution: puzzleToString(solution)
      });
      return puzzle.save();
    }
  },

  fetch: async function() {
    let response = await fetch("/boards.json");
    let boards = await response.json();

    let records = boards.starting.slice(0, 10).map(async (id, index)=> {
      let puzzle = this.store.peekRecord('puzzle', id);
      if(!puzzle) {
        let puzzle = this.store.createRecord('puzzle');
        puzzle.setProperties({
          id: id,
          givens: id.
          replace(/e/g,"00").
          replace(/d/g,"000").
          replace(/c/g,"0000").
          replace(/b/g,"00000").
          replace(/a/g,"000000"),
          solution: boards.solutions[index]
        });
        return puzzle.save();
      }
    });
    return all(records);
  },
  async reset() {
    let puzzles = await this.store.findAll('puzzle');
    await all(puzzles.map((puzzle)=> {
      puzzle.setProperties({
        startedAt: null,
        lastPlayedAt: null,
        secondsPlayed: null,
        completedAt: null
      });
      return puzzle.save();
    }));
    let cells = await this.store.findAll('sudoku-cell');
    return all(cells.map((cell)=> {
      cell.destroy();
    }));
  }
});
