import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("puzzle", { path: "puzzle/:id" });
  this.route("puzzles", { path: "puzzles" });
});

export default Router;
