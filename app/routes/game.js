import Route from "@ember/routing/route";
import SudokuCell from "dusoku/models/sudoku-cell";

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


    let board = [];
    for(let i = 0; i < 9; i++) {
      board[i] = board[i] || [];
      for(let j = 0; j < 9; j++) {
        let index = i * 9 + j;
        board[i][j] = SudokuCell.create({
          row: i,
          column: j,
          value: parseInt(model.solution[index], 10),
          given: model.given[index] !== "0"
        });
      }
    }
    controller.set("grid", board);
    controller.set("timer", 0);
  }
}

