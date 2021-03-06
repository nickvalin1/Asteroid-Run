Game.Level1 = function (game) {

    //my properties
    this.ground = null;
    this.fullScreenToggle = null;
    this.asteroids = null;
    
    this.largeAsteroidTimer = null;
    this.largeAsteroidSpawnRate = null;
    this.smallAsteroidTimer = null;
    this.smallAsteroidSpawnRate = null;
    this.standardAsteroidTimer = null;
    this.standardAsteroidSpawnRate = null;
    this.tinyAsteroidTimer = null;
    this.tinyAsteroidSpawnRate = null;
    //Explosive Mines, a special custom enemy type! They 
    this.explosiveMineTimer = null;
    this.explosiveMineSpawnRate = null;
    
    this.largeAsteroidBaseSpawnRate = 1200;
    this.smallAsteroidBaseSpawnRate = 800;
    this.standardAsteroidBaseSpawnRate = 600;
    this.tinyAsteroidBaseSpawnRate = 2000;
    
    
    
    this.largeAsteroidBaseSpawnRate = 1200;
    this.smallAsteroidBaseSpawnRate = 800;
    this.standardAsteroidBaseSpawnRate = 600;
    this.tinyAsteroidBaseSpawnRate = 2000;
    
    this.healthbar = null;
    this.hitTimer = null;
    this.style = null;
    this.yellowStyle = null;
    this.text = null;
    this.bg1 = null;
    this.bg2 = null;
    
    this.enemyAttack1=false;
    this.enemyAttack2=false;
    this.enemyTimer=0;
    
    //for testing purposes
    this.tester = null;
    
    
};

Game.Level1.prototype = {

    create: function () {
        
        //system buttons
        this.fullScreenToggle = this.input.keyboard.addKey(Phaser.Keyboard.F);
        this.fullScreenToggle.onUp.add(this.goFull, this);
        
        this.quitButton = this.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.quitButton.onUp.add(this.quitGame, this);
        
        // set back ground (there is two so scrolling is seemless)
        this.bg1 = this.game.add.sprite(0,0, 'bg');
        this.bg2 = this.game.add.sprite(this.bg1.width, 0, 'bg');
        
        // create player
        Game.player.add(100, 100);
    
        // initialize spawner
        Game.asteroidSpawner.init();
        
        //create enemy
        Game.rammingEnemy.add(-100,300);
        Game.enemy.add(-100,400,"right");
        
        // set timers for spawning asteroids
        this.largeAsteroidTimer = 1000;
        this.largeAsteroidSpawnRate = this.largeAsteroidBaseSpawnRate;
        this.smallAsteroidTimer = 900;
        this.smallAsteroidSpawnRate = this.smallAsteroidBaseSpawnRate;
        this.standardAsteroidTimer = 700;
        this.standardAsteroidSpawnRate = this.standardAsteroidBaseSpawnRate;
        this.tinyAsteroidTimer = 1200;
        this.tinyAsteroidSpawnRate = this.tinyAsteroidBaseSpawnRate;

        //Every ten seconds, an explosive mine appears.
        this.explosiveMineTimer = 10000;
        this.explosiveMineSpawnRate = 10000;
        
        // for testing
        this.tester = 0;
        
        // add healthbar
        this.healthbar = this.add.graphics();
        this.healthbar.beginFill(0xFF0000); // red
        this.healthbar.drawRect(50, 20, Game.player.health * 5, 16); // tie healthbar to player health
        
        // add new text style
        this.style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.yellowStyle = { font: "bold 16px Arial", fill: "#ff0", boundsAlignH: "center", boundsAlignV: "middle"};
        
        // add text
        this.text = this.game.add.text(900, 20, "Money: " + Game.player.money, this.yellowStyle);
        this.text = this.game.add.text(10, 20, "Hull", this.style);
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        
        // add timer to delay damage taken from hits
        this.hitTimer = 0;
    },

    update: function () {
        
        // make background scroll relative to asteroid's speed
        this.bg1.x += Game.asteroidSpawner.speed / 1000;
        this.bg2.x += Game.asteroidSpawner.speed / 1000;
        
        // move background that is no longer on the screen to the other side of the screen 
        if (this.bg1.x + this.bg1.width < 0)
            this.bg1.x = this.bg2.x + this.bg2.height;
        if (this.bg2.x + this.bg2.width < 0)
            this.bg2.x = this.bg1.x + this.bg1.height;
        
        // update player and asteroids
        Game.player.update();
        if (Game.rammingEnemy.sprite.x<-100) {
            Game.rammingEnemy.sprite.body.velocity.x=0;
        }
        if (Game.enemy.sprite.x<-100) {
            Game.enemy.sprite.body.velocity.x=0;
        }
        if (!this.enemyAttack1 && !this.enemyAttack2 && (Math.random()*Game.player.notoriety>9.99)) {
            var choice=Math.floor(Math.random() * (2 - 1 + 1)) + 1;
            if (choice==1) {
                this.enemyAttack1=true;
            }
            else if (choice==2) {
                this.enemyAttack2=true;
            }
        }
        if (this.enemyAttack1) {
            if (Game.enemy.sprite.x>-100) {
                Game.enemy.sprite.body.velocity.x=-200;
            }
            Game.player.posOffsetX=500;
            Game.rammingEnemy.update();
            this.enemyTimer++;
            if (this.enemyTimer>1000) {
                this.enemyAttack1=false;
                this.enemyTimer=0;
                Game.player.posOffsetX=Game.player.initX;
            }
        }
        else if (this.enemyAttack2) {
            if (Game.rammingEnemy.sprite.x>-100) {
                Game.rammingEnemy.sprite.body.velocity.x=-200;
            }
            Game.player.posOffsetX=500;
            Game.enemy.update();
            this.enemyTimer++;
            if (this.enemyTimer>1000) {
                this.enemyAttack2=false;
                this.enemyTimer=0;
                Game.player.posOffsetX=Game.player.initX;
            }
        }
        else {
            if (Game.rammingEnemy.sprite.x>-100) {
                Game.rammingEnemy.sprite.body.velocity.x=-200;
            }
            if (Game.enemy.sprite.x>-100) {
                Game.enemy.sprite.body.velocity.x=-200;
            }
        } 
        
        for(var i = 0; i < Game.asteroidSpawner.mines.length; i++){
            if(Game.asteroidSpawner.mines[i].exists){
                Game.asteroidSpawner.mines[i].update(Game.player);
            }
        }
        
        Game.asteroidSpawner.update();
        this.asteroidRateChange(Game.player);
        
        
        //this.game.physics.arcade.collide(Game.player.sprite, Game.asteroidSpawner.asteroids);
        //this.game.physics.arcade.collide(Game.asteroidSpawner.asteroids, Game.asteroidSpawner.asteroids);
        
        //Every asteroid of any type collides with every asteroid of any type.

        
        // MOVE THIS STUFF TO ASTEROID SPAWNER AT SOME POINT
        
        this.game.physics.arcade.collide(Game.asteroidSpawner.largeAsteroids, Game.asteroidSpawner.largeAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.largeAsteroids, Game.asteroidSpawner.standardAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.largeAsteroids, Game.asteroidSpawner.smallAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.largeAsteroids, Game.asteroidSpawner.tinyAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.standardAsteroids, Game.asteroidSpawner.standardAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.standardAsteroids, Game.asteroidSpawner.smallAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.standardAsteroids, Game.asteroidSpawner.tinyAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.smallAsteroids, Game.asteroidSpawner.smallAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.smallAsteroids, Game.asteroidSpawner.tinyAsteroids);
        this.game.physics.arcade.collide(Game.asteroidSpawner.tinyAsteroids, Game.asteroidSpawner.tinyAsteroids);
        
        this.game.physics.arcade.collide(Game.player.lasers, Game.asteroidSpawner.largeAsteroids, this.laserHitLargeAsteroid, null, this);
        this.game.physics.arcade.collide(Game.player.lasers, Game.asteroidSpawner.smallAsteroids, this.laserHitAsteroid, null, this);
        this.game.physics.arcade.collide(Game.player.lasers, Game.asteroidSpawner.standardAsteroids, this.laserHitAsteroid, null, this);
        this.game.physics.arcade.collide(Game.player.lasers, Game.asteroidSpawner.tinyAsteroids, this.laserHitTinyAsteroid, null, this);
        
        
        this.game.physics.arcade.overlap(Game.player.sprite, Game.asteroidSpawner.largeAsteroids, this.playerHitLargeAsteroid, null, this);
        this.game.physics.arcade.overlap(Game.player.sprite, Game.asteroidSpawner.standardAsteroids, this.playerHitAsteroid, null, this);
        this.game.physics.arcade.overlap(Game.player.sprite, Game.asteroidSpawner.smallAsteroids, this.playerHitAsteroid, null, this);

        // END COLLISION DETECTION
        

        // change healthbar size relative to player health (NEEDS FIXING)
        this.healthbar.width = Game.player.health * 5;
        
        // increment distance relative to asteroid speed
        Game.distance += -Game.asteroidSpawner.speed / 100;
        
        // change level once distance exceeds some point
        if (Game.distance >= 10000 * Game.level) { // right now level multiplies the distance needed to go before next lvl
            Game.level++;
            Game.player.money += Game.player.cargoAmount;
            Game.player.cargo = null;
            Game.player.cargoAmount = 0;
            this.state.start('LevelComplete');
        }
        
        // stop spawning asteroids after a point to give the illusion that we are leaving the asteroid field
        else if (Game.distance >= 10000 * Game.level - 1100) {
            //this.asteroidSpawnRate = 10000000;
            this.largeAsteroidSpawnRate = 10000000;
            this.standardAsteroidSpawnRate = 10000000;
            this.smallAsteroidSpawnRate = 10000000;
            this.tinyAsteroidSpawnRate = 10000000;
        }
        
        // I don't remember. . .I think we're starting out each level slow 
        else if (Game.distance >= 6000 + 1000) {
            this.largeAsteroidSpawnRate = 1200;
            this.standardAsteroidSpawnRate = 800;
            this.smallAsteroidSpawnRate = 600;
            this.tinyAsteroidSpawnRate = 2000;
        }
        
        if (this.game.time.now > this.largeAsteroidTimer){
            Game.asteroidSpawner.spawnLargeAsteroid();
            this.largeAsteroidTimer = this.game.time.now + this.largeAsteroidSpawnRate;
            this.tester +=1;
        }
        
        if (this.game.time.now > this.standadrdAsteroidTimer){
            Game.asteroidSpawner.spawnStandardAsteroid();
            this.standardAsteroidTimer = this.game.time.now + this.standardAsteroidSpawnRate;
            this.tester +=1;
        }
        
        if (this.game.time.now > this.smallAsteroidTimer){
            Game.asteroidSpawner.spawnSmallAsteroid();
            this.smallAsteroidTimer = this.game.time.now + this.smallAsteroidSpawnRate;
            this.tester +=1;
        }
        
        if (this.game.time.now > this.tinyAsteroidTimer){
            Game.asteroidSpawner.spawnTinyAsteroid();
            this.tinyAsteroidTimer = this.game.time.now + this.tinyAsteroidSpawnRate;
            this.tester +=1;
        }
        
        if (this.game.time.now > this.explosiveMineTimer){
            Game.asteroidSpawner.spawnExplosiveMine();
            this.explosiveMineTimer = this.game.time.now + this.explosiveMineSpawnRate;
            
            
        }
        
        // kill player and go to game over when health is zero
        if (Game.player.health <= 0) {
            // save highscore
            if (Game.distance > Game.highscore)
                Game.highscore = Game.distance;
            // reset variables
            Game.distance = 0;
            Game.level = 1;
            Game.player.health = 100;
            Game.player.damages = [];
            // only then change screen to game over
            this.state.start('GameOver');
        }
        
    },
    
    // call back for player colliding with asteroid any asteroid that isn't large or tiny
    playerHitAsteroid: function (player, asteroid) {
        if (this.game.time.now > this.hitTimer) {
            Game.player.health -= asteroid.scale.x * 2.5 + (-asteroid.body.velocity.x / 100) * 1.5;
            Game.player.damage(asteroid.scale.x * 2.5 + (-asteroid.body.velocity.x / 100) * 1.5);
            this.hitTimer = this.game.time.now + 100;
        }
        if (asteroid.y > player.y) {
            asteroid.y += 2;
            asteroid.body.angularVelocity = 50;
        }
        else if (asteroid.y < player.y) {
            asteroid.y -= 2;
            asteroid.body.angularVelocity = -50;
        }
        
    },
    
    // call back for player colliding with large asteroid
    playerHitLargeAsteroid: function (player, asteroid) {
        if (Game.asteroidSpawner.speed <= -250 && Math.abs(player.y - asteroid.y) < 10) {
            Game.player.health -= 50;
            Game.player.damage(50);
            this.hitTimer = this.game.time.now + 250;
            
        }
        
        else if (this.game.time.now > this.hitTimer) {
            Game.player.health -= asteroid.scale.x * 2.5 + (-asteroid.body.velocity.x / 100) * 1.5;
            Game.player.damage(asteroid.scale.x * 2.5 + (-asteroid.body.velocity.x / 100) * 1.5);
            this.hitTimer = this.game.time.now + 100;
        }
        if (asteroid.y > player.y) {
            player.y -= 3;
            asteroid.y += 1;
            asteroid.body.angularVelocity = 50;
        }
        else if (asteroid.y < player.y) {
            player.y += 3;
            asteroid.y -= 1;
            asteroid.body.angularVelocity = -50;
        }
        
    },
    
    // call back for laser colliding with any but large or tiny asteroid
    laserHitAsteroid: function (laser, asteroid) {
        laser.kill();
        for (var i=-1; i<2; i++) {
            var newAsteroid = Game.asteroidSpawner.tinyAsteroids.getFirstExists(false);
            if (newAsteroid!=null) {
                newAsteroid.reset(asteroid.x + (Math.random()*20*i), asteroid.y + (Math.random()*50*i));
                newAsteroid.body.velocity.y = Math.random() * 40*i;
                newAsteroid.body.velocity.x = asteroid.body.velocity.x-(Math.random()*20);
            }
        }
        asteroid.kill();
    },
    
    // call back for laser colliding with large asteroid
    laserHitLargeAsteroid: function (laser, asteroid) {    
        laser.kill();
        for (var i=-1; i<2; i++) {
            var newAsteroid = Game.asteroidSpawner.smallAsteroids.getFirstExists(false);
            if (newAsteroid!=null) {
                newAsteroid.reset(asteroid.x + (Math.random()*20*i), asteroid.y + (Math.random()*50*i));
                newAsteroid.body.velocity.y = Math.random() * 40*i;
                newAsteroid.body.velocity.x = asteroid.body.velocity.x-(Math.random()*20);
            }
        }
        asteroid.kill();
        
    },
    
    // call back for laser colliding with tiny asteroid
    laserHitTinyAsteroid: function (laser, asteroid) {
        asteroid.kill();
        laser.kill();
    },
    
    
    //Regulates the rate at which asteroids spawn. As you go faster (the right cursor is held down, for //lack of any other metric), the asteroid spawn rate becomes faster as well. Vice versa for going //slower.
    
    

    asteroidRateChange: function(player){
        if(player.cursors.right.isDown && !player.checkForDamageType('lowerSpeed')){
            this.largeAsteroidSpawnRate = this.largeAsteroidBaseSpawnRate - 500;
            this.smallAsteroidSpawnRate = this.smallAsteroidBaseSpawnRate - 500;
            this.standardAsteroidSpawnRate = this.standardAsteroidBaseSpawnRate - 500;
            this.tinyAsteroidSpawnRate = this.tinyAsteroidBaseSpawnRate - 500;
        }
        else if(player.cursors.left.isDown){
            this.largeAsteroidSpawnRate = this.largeAsteroidBaseSpawnRate + 500;
            this.smallAsteroidSpawnRate = this.smallAsteroidBaseSpawnRate + 500;
            this.standardAsteroidSpawnRate = this.standardAsteroidBaseSpawnRate + 500;
            this.tinyAsteroidSpawnRate = this.tinyAsteroidBaseSpawnRate + 500;
        }
        
        else{
            this.largeAsteroidSpawnRate = this.largeAsteroidBaseSpawnRate;
            this.smallAsteroidSpawnRate = this.smallAsteroidBaseSpawnRate;
            this.standardAsteroidSpawnRate = this.standardAsteroidBaseSpawnRate;
            this.tinyAsteroidSpawnRate = this.tinyAsteroidBaseSpawnRate;
        }
        
        
    },


    // call back for quiting level
    quitGame: function () {
        //reset variables
        Game.level = 1;
        Game.player.health = 100;
        Game.player.damages = [];
        Game.player.cargo = 'spices';
        Game.player.cargoAmount = 150;
        this.state.start('MainMenu');
    },
    
    // call back for full screen
    goFull: function() {
        if (this.scale.isFullScreen)
            this.scale.stopFullScreen();
        else
            this.scale.startFullScreen(false);
    },
    
    // debug stuff
    render: function() {
//        this.game.debug.text("test asteroids: " + this.tester +
//                             "\ntime: " + this.game.time.now + 
//                             "\nasteroidTimer: " + this.asteroidTimer, 32, 500);
        //this.game.debug.text("Distance: " + Math.floor(Game.distance), 800, 20);
        this.game.debug.text("Cargo: " + Game.player.cargo + " - " + Game.player.cargoAmount + "g", 10, 680);
        //this.game.debug.text("damage types: " + Game.player.damageTypes, 10, 680);
        this.game.debug.text("damages: " + Game.player.damages, 10, 700);
        //this.game.debug.text("Health: " + Game.player.health, 10, 650);
    }
};