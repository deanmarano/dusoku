import Route from '@ember/routing/route';
import { alias } from '@ember/object/computed';
import { storageFor } from 'ember-local-storage';
import { hash } from 'rsvp';

export default Route.extend({
  app: storageFor('application-state'),
  currentPuzzleId: alias('app.currentPuzzleId'),

  model() {
    return hash({
      puzzles: this.store.findAll('puzzle'),
      currentPuzzle: this.currentPuzzleId ? this.store.findRecord('puzzle', this.currentPuzzleId) : null
    });
  },

});
