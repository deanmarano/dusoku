import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    puzzleCompleted() {
      return this.model.complete();
    }
  }
});
