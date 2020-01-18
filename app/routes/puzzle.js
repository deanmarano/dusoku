import Route from "@ember/routing/route";
import { storageFor } from 'ember-local-storage';
import { inject as service } from '@ember/service';

export default Route.extend({
  puzzles: service(),
  app: storageFor('application-state'),
  async model({ id }) {
    if(id === "new") {
      let puzzle = this.store.createRecord('puzzle');
      await puzzle.save();
      return this.transitionTo("puzzle", puzzle);
    } else {
      return this.store.findRecord('puzzle', id);
    }
  },

  afterModel(model) {
    if(!model) {
      this.transitionTo('index');
    }
    if(model.completedAt) {
      this.app.set('currentPuzzleId', null);
      return this.transitionTo("puzzle.completed", model);
    }
    this.store.query('sudoku-cell', {
      puzzle: model.id
    });
    this.get('app').set('currentPuzzleId', model.id);
    model.start();
  }
});

