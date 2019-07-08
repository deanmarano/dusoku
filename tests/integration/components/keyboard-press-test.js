import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | keyboard-press', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`
      <KeyboardPress @key="Digit1" @on-press=testAction>
        template block text
      </KeyboardPress>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
