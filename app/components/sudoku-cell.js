import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';


export default Component.extend({
  tagName: 'button',
  classNames: ['sudoku-cell'],
  classNameBindings: ['error', 'selected', 'given', 'sameValue'],
  error: readOnly('cell.error'),
  selected: readOnly('cell.selected'),
  given: readOnly('cell.given'),
  sameValue: computed('cell.displayValue', 'currentlySelectedCell', 'currentlySelectedCell.displayValue', function() {
    return this.cell.displayValue &&
      this.currentlySelectedCell &&
      this.cell.id !== this.currentlySelectedCell.id &&
      (this.cell.displayValue === this.currentlySelectedCell.displayValue);
  }),
  click(){
    this.select(this.cell);
  }
});
