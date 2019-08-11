import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  rows: 11,
  columns: 10,
  showTiles: false,
  image: '/screenshot1.png',
  boardHeight: computed('rows', function() {
    return this.rows * 30;
  }),
  boardWidth: computed('columns', function() {
    return this.columns * 30;
  }),
  didInsertElement() {
    let tiles = window.localStorage.getItem('tiles')
    tiles = tiles ? JSON.parse(tiles) : [];
    this.set('tiles',  tiles);
    let board = [];
    let grass = tiles.findBy('name', 'grass');
    let settings = [
      ['grass', 'grass', 'grass', 'sparse grass', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank'],
      ['grass', 'grass', 'grass', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank'],
      ['grass', 'grass', 'grass', 'blank', 'sparse grass', 'blank', 'blank', 'blank', 'blank', 'blank'],
      ['grass', 'grass', 'grass', 'more grass', 'more grass', 'blank', 'blank', 'blank', 'blank', 'blank'],
      ['grass', 'grass', 'grass', 'more grass', 'more grass', 'blank', 'blank', 'blank', 'blank', 'blank'],
      ['blank', 'sparse grass', 'blank', 'sparse grass', 'blank', 'sparse grass', 'blank', 'sparse grass', 'blank', 'sparse grass'],
      ['sparse grass', 'blank', 'sparse grass', 'blank', 'sparse grass', 'blank', 'sparse grass', 'blank', 'sparse grass', 'blank'],
      ['blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank'],
      ['grass', 'grass', 'grass', 'blank', 'blank', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush', 'bush'],
      ['blank', 'sparse grass', 'blank', 'sparse grass', 'blank', 'left roof', 'rooftop', 'rooftop', 'right roof', 'sparse grass']
    ];

    for(let column = 0; column < this.columns; column++) {
      for(let row = 0; row < this.rows; row++) {
        let tile = this.tiles.findBy('name', settings[row][column]);
        console.log(`${row} ${column} ${settings[row][column]}`);
        board.push({
          x: column * 30,
          y: row * 30,
          order: row * this.columns + column,
          src: tile.src,
          name: tile.name
        });
      }
    }
    this.set('board', board);
  },
  actions: {
    doTheThing() {
      let blocks = [];
      const canvas = this.element.querySelector('canvas');
      const image = this.element.querySelector('img');
      let rowWidth = image.naturalHeight / 9;
      let columnWidth = image.naturalWidth / 10;
      var context = canvas.getContext('2d');
      canvas.height = image.naturalHeight / 9;
      canvas.width = image.naturalWidth / 10;

      for(let column = 0; column < 10; column++) {
        for(let row = 0; row < 9; row++) {
          context.drawImage(
            image,
            row * rowWidth, column * columnWidth, rowWidth, columnWidth,
            0, 0, rowWidth, columnWidth);
          let src = canvas.toDataURL('image/png');
          context.clearRect(0, 0, canvas.width, canvas.height);
          blocks.push({
            src,
            column,
            row
          });
        }
      }
      this.set("blocks", blocks);
    },
    save(block) {
      this.tiles.pushObject(block);
      window.localStorage.setItem("tiles", JSON.stringify(this.tiles));
    },
    removeTile(tile) {
      this.tiles.removeObject(tile);
      window.localStorage.setItem("tiles", JSON.stringify(this.tiles));
    },
    toggleTiles() {
      this.toggleProperty('showTiles');
    },
    toggleBlocks() {
      this.toggleProperty('showBlocks');
    }
  }
});
