import Route from "@ember/routing/route";

export default class extends Route {
  async model({ id }) {
    let response = await fetch("/boards.json");
    let boards = await response.json();

    return {
      given: boards.starting[id],
      solution: boards.solutions[id]
    }
  }
  setupController(controller, model) {
    model.given = model.given.replace(/e/g,"00");
    model.given = model.given.replace(/d/g,"000");
    model.given = model.given.replace(/c/g,"0000");
    model.given = model.given.replace(/b/g,"00000");
    model.given = model.given.replace(/a/g,"000000");

    controller.setProperties(model);
  }
}

