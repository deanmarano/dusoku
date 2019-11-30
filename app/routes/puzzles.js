import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  puzzles: service(),
  model() {
    return this.store.findAll('puzzle');
  },
  setupController(controller, model) {
    controller.set('puzzles', model);
  },
  actions: {
    fetchPuzzles: async function() {
      this.toggleProperty("refreshing");
      await this.puzzles.fetch();
      this.toggleProperty("refreshing");
    },
    async reset() {
      this.puzzles.reset();
    }
  }
});
