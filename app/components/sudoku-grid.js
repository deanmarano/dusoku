import Component from '@ember/component';
import { computed, set } from '@ember/object';

export default Component.extend({
  currentlySelectedCell: null,
  actions: {
    moveSelection(direction) {
      let nextCell;
      switch(direction) {
        case "down":
          nextCell = this.model[this.currentlySelectedCell.row + 1].findBy('column', this.currentlySelectedCell.column);
          break;
        case "up":
          nextCell = this.model[this.currentlySelectedCell.row - 1].findBy('column', this.currentlySelectedCell.column);
          break;
        case "left":
          nextCell = this.model[this.currentlySelectedCell.row].findBy('column', this.currentlySelectedCell.column - 1);
          break;
        case "right":
          nextCell = this.model[this.currentlySelectedCell.row].findBy('column', this.currentlySelectedCell.column + 1);
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
      if(this.get('currentlySelectedCell.value') === cell.value) {
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
    },

    clearCell() {
      this.set('currentlySelectedCell.hints', []);
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
      for(let row in this.model) {
        for(let cell in row) {
          if(cell.value != cell.displayValue) {
            set('cell', 'error', true);
          }
        }
      }

    }
  }
});
