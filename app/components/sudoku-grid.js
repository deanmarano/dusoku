import Component from '@ember/component';
import { set, computed } from '@ember/object';

function isFinished(number) {
  return computed('cells.@each.correct', function() {
    return this.cells.
      filterBy('value', number).
      every(cell => cell.correct);
  });
}

export default Component.extend({
  currentlySelectedCell: null,
  timer: 0,
  didInsertElement() {
    this.set('intervalPid', this.interval());
    document.addEventListener("visibilitychange", () => {
      if(document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    }, false);
  },
  willDestroyElement() {
    this.pause();
  },

  interval() {
    return setInterval(()=> {
      this.set('timer', this.timer + 1);
    }, 1000);
  },

  pause() {
    if(this.intervalPid) {
      clearInterval(this.intervalPid);
      this.set('intervalPid', null);
    }
  },

  resume() {
    if(!this.intervalPid) {
      this.set('intervalPid', this.interval());
    }
  },

  timeElapsed: computed("timer", function() {
    return `${Math.floor(this.timer / 60).toString().padStart(2, 0)}:${(this.timer % 60).toString().padStart(2, 0)}`;
  }),

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
    return grid;
  }),

  onesFinished: isFinished(1),
  twosFinished: isFinished(2),
  threesFinished: isFinished(3),
  foursFinished: isFinished(4),
  fivesFinished: isFinished(5),
  sixesFinished: isFinished(6),
  sevensFinished: isFinished(7),
  eightsFinished: isFinished(8),
  ninesFinished: isFinished(9),

  actions: {
    moveSelection(direction, event) {
      event.preventDefault();
      if(!this.currentlySelectedCell) {
        this.actions.select.call(this, this.grid[4].findBy('column', 4));
        return;
      }
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

    async selectNumber(number) {
      if(!this.currentlySelectedCell) {
        return;
      }

      if(this.hintMode) {
        if(this.guess) {
          this.set('guess', null);
        }
        let hints = this.currentlySelectedCell.hints;
        if(hints.includes(number)) {
          this.set('currentlySelectedCell.hints', hints.removeObject(number));
        } else {
          this.set('currentlySelectedCell.hints', hints.addObject(number));
        }
      } else {
        this.set('currentlySelectedCell.guess', number);
      }
      await this.currentlySelectedCell.save();
      if(this.correct) {
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
    toggleHintMode() {
      this.toggleProperty('hintMode');
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
