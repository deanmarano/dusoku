import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { storageFor } from 'ember-local-storage';

export default Controller.extend({
  app: storageFor('application-state'),
  router: service(),
  actions: {
    async puzzleCompleted() {
      await this.model.complete();
      this.app.set('currentPuzzleId', null);
      this.router.transitionTo("puzzle.completed", this.model);
    }
  }
});
