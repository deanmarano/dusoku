import Route from "@ember/routing/route";
import SudokuCell from "dusoku/models/sudoku-cell";
import Puzzle from "dusoku/models/puzzle";

export default class extends Route {
  async model({ id }) {
    let response = await fetch("/boards.json");
    let boards = await response.json();

    return Puzzle.create({
      given: boards.starting[id],
      solution: boards.solutions[id]
    })
  }

  setupController(controller, model) {
    model.given = model.given
      .replace(/e/g,"00")
      .replace(/d/g,"000")
      .replace(/c/g,"0000")
      .replace(/b/g,"00000")
      .replace(/a/g,"000000");


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
  }
}

