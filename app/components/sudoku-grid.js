import Component from '@ember/component';
import { set, computed } from '@ember/object';

export default Component.extend({
  currentlySelectedCell: null,
  grid: computed("cells.@each", function() {
    let grid = [];
    let cells = this.get("cells").toArray();
    for(let i = 0; i < 9; i++) {
      grid[i] = grid[i] || [];
      for(let j = 0; j < 9; j++) {
        let index = i * 9 + j;
        grid[i][j] = cells[index];
      }
    }
    window.grid = grid;
    window.puzzle = this;
    return grid;
  }),

  actions: {
    moveSelection(direction) {
      let nextCell;
      switch(direction) {
        case "down":
          nextCell = this.grid[this.currentlySelectedCell.row + 1].findBy('column', this.currentlySelectedCell.column);
          break;
        case "up":
          nextCell = this.grid[this.currentlySelectedCell.row - 1].findBy('column', this.currentlySelectedCell.column);
          break;
        case "left":
          nextCell = this.grid[this.currentlySelectedCell.row].findBy('column', this.currentlySelectedCell.column - 1);
          break;
        case "right":
          nextCell = this.grid[this.currentlySelectedCell.row].findBy('column', this.currentlySelectedCell.column + 1);
          break;

      }
      if(nextCell) {
        this.actions.select.call(this, nextCell);
      }
    },
    select(cell) {
      if(this.currentlySelectedCell) {
        this.set('currentlySelectedCell.selected', false);
      }
      // if click again
      if(this.get('currentlySelectedCell.index') === cell.index) {
        this.set('currentlySelectedCell', null);
      } else {
        this.set('currentlySelectedCell', cell);
        this.set('currentlySelectedCell.selected', true);
      }
    },

    selectNumber(number) {
      if(!this.currentlySelectedCell) {
        return;
      }

      let hints = this.currentlySelectedCell.hints;
      if(this.currentlySelectedCell.guess) {
        hints.addObject(this.currentlySelectedCell.guess);
      }

      if(hints.includes(number)) {
        this.set('currentlySelectedCell.hints', hints.removeObject(number));
      } else {
        this.set('currentlySelectedCell.hints', hints.addObject(number));
      }
      if(hints.length === 1) {
        this.set('currentlySelectedCell.guess', hints[0]);
        this.set('currentlySelectedCell.hints', []);
      } else {
        this.set('currentlySelectedCell.guess', null);
      }
      if(this.completed) {
        this.puzzleCompleted();
      }
    },

    clearCell() {
      this.set('currentlySelectedCell.hints', []);
      this.set('currentlySelectedCell.guess', null);
      this.set('currentlySelectedCell.error', null);
    },

    inverseSelection() {
      if(!this.currentlySelectedCell) {
        return;
      }
      let invertedHints = [];
      let hints = this.currentlySelectedCell.hints;
      for(let i = 1; i <= 9; i++) {
        if(!hints.includes(i)) {
          invertedHints.push(i);
        }
      }
      this.set('currentlySelectedCell.hints', invertedHints);
    },

    checkPuzzle() {
      for(let row of this.grid) {
        for(let cell of row) {
          if(cell.guess && cell.guess != cell.value) {
            set(cell, 'error', true);
          }
        }
      }

    }
  }
});
