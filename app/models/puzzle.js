import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  startedAt: attr('date'),
  lastPlayedAt: attr('date'),
  secondsPlayed: attr('number'),
  completedAt: attr('date'),
  solution: attr(),
  givens: attr(),

  cells: hasMany('cell') // an array of cells, with each cell containing a list of actions
});
