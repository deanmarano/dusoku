import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { puzzleToString, puzzleStringToId } from 'dusoku/models/puzzle';
import { makepuzzle } from 'sudoku';

module('Unit | Model | puzzle', function(hooks) {
  setupTest(hooks);

  test('puzzleToString/1', function(assert) {
    let generatedPuzzle = makepuzzle();
    let sudokuString = puzzleToString(generatedPuzzle);
    assert.equal(generatedPuzzle.length, 81);
    assert.equal(sudokuString.length, 81);
  });

  test('puzzleStringToId/1', function(assert) {
    let sudokuString = ' 30     4   83  6 7          3  0 42     25   4    6       1 76  4    2 8  64 3  ';
    let sudokuId = puzzleStringToId(sudokuString);
    assert.ok(sudokuId.length < 81);
  });
});
