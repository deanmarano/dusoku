import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { puzzleToString, puzzleStringToId } from 'dusoku/services/puzzles';
import { makepuzzle } from 'sudoku';

module('Unit | Service | puzzles', function(hooks) {
  setupTest(hooks);

  test('puzzleToString/1', function(assert) {
    let generatedPuzzle = makepuzzle();
    let sudokuString = puzzleToString(generatedPuzzle);
    assert.equal(generatedPuzzle.length, 81);
    assert.equal(sudokuString.length, 81);
  });

  test('puzzleStringToId/1', function(assert) {
    let sudokuString = '030000004000830060700000000003000042000002500040000600000001076004000020800640300';
    let sudokuId = puzzleStringToId(sudokuString);
    assert.ok(sudokuId.length < 81);
  });
});
