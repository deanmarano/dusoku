import Service, { inject as service } from '@ember/service';
import { all } from 'rsvp';

export default Service.extend({
  store: service(),
  loaded: true,
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
