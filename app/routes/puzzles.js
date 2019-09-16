import Route from '@ember/routing/route';
import { all } from 'rsvp';

export default Route.extend({
  model() {
    return this.store.findAll('puzzle');
  },
  setupController(controller, model) {
    controller.set('puzzles', model);
  },
  actions: {
    fetchPuzzles: async function() {
      this.toggleProperty("refreshing");
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
      await all(records);
      this.toggleProperty("refreshing");
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
      await all(cells.map((cell)=> {
        cell.destroy();
      }));

    }
  }
});
