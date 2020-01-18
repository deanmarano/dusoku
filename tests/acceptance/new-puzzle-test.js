import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | new puzzle', function(hooks) {
  setupApplicationTest(hooks);

  test('the new puzzle buttons redirects to a puzzle', async function(assert) {
    await visit('');
    await click('[data-test-new-puzzle]');

    assert.ok((/\/puzzle\/[a-e0-9]*/).exec(currentURL()), 'redirects to new game route');
  });
});
