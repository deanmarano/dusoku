import Component from '@ember/component';
import { computed, set, action } from '@ember/object';

export default class extends Component {
  currentlySelectedCell = null;

  didInsertElement() {
    this.set('intervalPid', this.interval());
    document.addEventListener("visibilitychange", () => {
      if(document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    }, false);
  }

  interval() {
    return setInterval(()=> {
      this.set('timer', this.timer + 1);
    }, 1000);
  }

  pause() {
    if(this.intervalPid) {
      clearInterval(this.intervalPid);
      this.set('intervalPid', null);
    }
  }

  resume() {
    if(!this.intervalPid) {
      this.set('intervalPid', this.interval());
    }
  }
  @computed("timer")
  get timeElapsed() {
    return `${Math.floor(this.timer / 60).toString().padStart(2, 0)}:${(this.timer % 60).toString().padStart(2, 0)}`;
  }

  @action
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
  }

  @action
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
  }

  @action
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
  }

  @action
  clearCell() {
    this.set('currentlySelectedCell.hints', []);
    this.set('currentlySelectedCell.guess', null);
    this.set('currentlySelectedCell.error', null);
  }

  @action
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
  }

  @action
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
