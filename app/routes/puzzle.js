import Route from "@ember/routing/route";
import { storageFor } from 'ember-local-storage';

export default Route.extend({
  app: storageFor('application-state'),
  model({ id }) {
    return this.store.findRecord('puzzle', id);
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

