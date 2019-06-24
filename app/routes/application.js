import Route from '@ember/routing/route';
import SudokuCell from '../models/sudoku-cell';

export default Route.extend({
  model() {
    // 8 9 1 3 2 6 4 7 5
    // 2 7 3 9 4 5 1 6 8
    // 5 6 4 8 1 7 3 2 9
    // 3 8 6 2 7 1 9 5 4
    // 1 5 9 6 3 4 2 8 7
    // 7 4 2 5 9 8 6 1 3
    // 9 3 8 1 5 2 7 4 6
    // 6 2 7 4 8 9 5 3 1
    // 4 1 5 7 6 3 8 9 2
    return [
      [
        {value: 8},
        {value: 9, given: true},
        {value: 1},
        {value: 3},
        {value: 2},
        {value: 6, given: true},
        {value: 4},
        {value: 7},
        {value: 5},
      ],
      [
        {value: 2, given: true},
        {value: 7},
        {value: 3},
        {value: 9},
        {value: 4, given: true},
        {value: 5, given: true},
        {value: 1, given: true},
        {value: 6},
        {value: 8},
      ],
      [
        {value: 5, given: true},
        {value: 6, given: true},
        {value: 4},
        {value: 8, given: true},
        {value: 1},
        {value: 7, given: true},
        {value: 3},
        {value: 2},
        {value: 9},
      ],
      [
        {value: 3, given: true},
        {value: 8},
        {value: 6},
        {value: 2},
        {value: 7},
        {value: 1},
        {value: 9, given: true},
        {value: 5, given: true},
        {value: 4},
      ],
      [
        {value: 1, given: true},
        {value: 5},
        {value: 9},
        {value: 6},
        {value: 3},
        {value: 4},
        {value: 2},
        {value: 8},
        {value: 7, given: true},
      ],
      [
        {value: 7},
        {value: 4, given: true},
        {value: 2, given: true},
        {value: 5},
        {value: 9},
        {value: 8},
        {value: 6},
        {value: 1},
        {value: 3, given: true},
      ],
      [
        {value: 9},
        {value: 3},
        {value: 8},
        {value: 1, given: true},
        {value: 5},
        {value: 2, given: true},
        {value: 7},
        {value: 4, given: true},
        {value: 6, given: true},
      ],
      [
        {value: 6},
        {value: 2},
        {value: 7, given: true},
        {value: 4, given: true},
        {value: 8, given: true},
        {value: 9},
        {value: 5},
        {value: 3},
        {value: 1, given: true},
      ],
      [
        {value: 4},
        {value: 1},
        {value: 5},
        {value: 7, given: true},
        {value: 6},
        {value: 3},
        {value: 8},
        {value: 9, given: true},
        {value: 2},
      ],
    ].map((row, rowIndex) => {
      return row.map((cell, columnIndex) => {
        cell.row = rowIndex;
        cell.column = columnIndex;
        return SudokuCell.create(cell);
      });
    });
  }
});
