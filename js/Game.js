/*
The MIT License (MIT)
Copyright (c) 2015 Franco Cavestri
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

ZombiesGame.Game = function (game) {

  this.player;
  this.floor;
  this.head;
  this.cursors;
  this.zombies;
  this.scoreText;
  this.zombieTime = 0;
  this.score = 0;
  this.live = 100;
  this.horde = 20;
  this.scoreUp = 13;
  this.scoreDown = 6;

  };

  ZombiesGame.Game.prototype = {

  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.floor = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, this.game.stage.bounds.height, "floor");

    this.player = this.game.add.sprite((this.game.stage.bounds.width / 2) - (this.game.cache.getImage("jeep").width / 2) , this.game.stage.bounds.height, "jeep");
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.zombies = this.game.add.group();
    this.zombies.createMultiple(this.horde, "zombie");

    this.game.time.events.loop(2000, this.addZombie, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.head = this.game.add.sprite(-10, -2, "head");
    this.game.physics.arcade.enable(this.head);
    this.head.body.immovable = true;

    this.scoreText = this.game.add.text(390, 40, '0', { fontSize: '12px', fill: '#FFF' });
    this.scoreText.anchor.set(1);

    this.emitter = this.game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('blood');
    this.emitter.setYSpeed(-150, 150);
    this.emitter.setXSpeed(-150, 150);
    this.emitter.gravity = 5;

  },

  update: function () {
    this.game.physics.arcade.overlap(this.player, this.zombies, this.killZombie, null, this);

    this.player.body.velocity.x = 0;
    this.floor.tilePosition.y += 1;

    var i;
    for(i = 0; i < this.zombies.length; i++) {
      this.zombies.getAt(i).animations.play('walk');
    }

    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = - 150;

    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 150;
    } else if(this.cursors.up.isDown && this.player.y > 70) {
      this.player.body.velocity.y = -200;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = 150
    } else {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
    }
  },

  getRandom: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  killZombie: function (player, zombie) {
    zombie.destroy();
    this.score += this.scoreUp;
    this.scoreText.text = this.score;
    this.addZombie();
    this.game.add.tween(this.player.scale).to({x: 1.1, y: 1.1}, 50).to({x: 1, y: 1}, 150).start();
    this.emitter.x = zombie.x;
    this.emitter.y = zombie.y;
    this.emitter.start(true, 300, null, 15);
  },

  missedZombie: function () {
      this.score -= this.scoreDown;
      this.scoreText.text = this.score;
  },

  addZombie: function () {
    var zombie = this.zombies.create(this.getRandom(0, 325), 0, "zombie");
    this.game.physics.arcade.enable(zombie);
    zombie.body.velocity.y = 150;
    zombie.checkWorldBounds = true;
    zombie.animations.add("walk", [0,1,2,3,4,5,6,7], 8, true);
    zombie.events.onOutOfBounds.add(this.missedZombie, this);
  }
};
