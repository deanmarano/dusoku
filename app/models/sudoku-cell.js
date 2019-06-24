import EmberObject from '@ember/object';
import { computed } from "@ember/object";

export default EmberObject.extend({
  init() {
    this.hints = [];
  },

  displayValue: computed('given', 'guess', function() {
    if(this.given) {
      return this.value;
    } else {
      return this.guess;
    }
  })
});
