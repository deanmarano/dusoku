import Route from "@ember/routing/route";
import { storageFor } from 'ember-local-storage';

export default Route.extend({
  app: storageFor('application-state'),
  model({ id }) {
    return this.store.peekRecord('puzzle', id);
  },

  afterModel(model) {
    if(!model) {
      this.transitionTo('index');
    }
    this.get('app').set('currentPuzzleId', model.id);
    model.start();
  }
});

