
class Planet {
    constructor(game){
        this.game=game;
        this.x=this.game.width*0.5;
        this.y=this.game.height*0.4;;
        this.radius=80;
        this.image=document.getElementById('planet');
    }

    draw(context){
        context.drawImage(this.image, this.x-100, this.y-100);

        if(this.game.debug){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2);
        context.stroke();
        }
    }
 }



 class Player{
    constructor(game){
        this.game=game;
        this.x=this.game.width*0.5;
        this.y=this.game.height*0.4;;
        this.radius=40;
        this.image=document.getElementById('player');
        this.aim;
        this.angle=Math.PI*2;
    }

    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image,-this.radius,-this.radius);

        if(this.game.debug){
        context.beginPath();
        context.arc(0,0, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        }
        context.restore();
    }


    update(){
    //this.x++;
        this.aim=this.game.calcAim(this.game.mouse, this.game.planet);
        this.x=this.game.planet.x + this.game.planet.radius * this.aim[0];
        this.y=this.game.planet.y + this.game.planet.radius * this.aim[1];
        this.angle=Math.atan2(this.aim[3], this.aim[2]);
    }

    shoot(){
        const projectile=this.game.getProjectile();
        if(projectile) projectile.start(this.x+this.radius * this.aim[0],this.y + this.radius * this.aim[1], this.aim[0],this.aim[1]);
    }
 }



class Projectile{
    //garbage collision
    constructor(game){
        this.game=game;
        this.x;
        this.y;
        this.radius=15;

        this.speedX=1;
        this.speedY=1;
        this.speedModifier=15;
        this.free=true;

    }
    start(x,y,speedX,speedY){
        this.free=false;
        this.x=x;
        this.y=y;
        this.speedX=speedX*this.speedModifier;
        this.speedY=speedY*this.speedModifier;
    }

    reset(){
        this.free=true;
    }

    //only if its active
    draw(context){
        if(!this.free){
            context.save();
            context.beginPath();
            context.arc(this.x, this.y,this.radius, 0, Math.PI * 2);
            context.fillStyle='gold';
            context.fill();
            context.restore();

        }
    }

    update(context){
        if(!this.free){
            this.x+=this.speedX;
            this.y+=this.speedY;

        }
        if(this.x<0||this.x>this.game.width|| this.y < 0 || this.y > this.game.height) {
            this.reset();
        }
    }
}






class Enemy{
    //garbage collision
    constructor(game){
        this.game=game;
        this.x=100;
        this.y=100;
        this.radius=40;
        this.width=this.radius * 2;
        this.height=this.radius *2;
        this.speedX=0;
        this.speedY=0;
        this.angle=0;
        this.collided=false;
        this.speedModifier=Math.random()*0.5 + 0.1;
        this.free=true;

    }
    start(){
        this.free=false;
        this.collided=false;

        this.frameX=0;
        this.lives=this.maxLives;

        this.frameY=Math.floor(Math.random()*3);


        //so that they appear off screa

        //sothat enemies dont appear in the middle

        if(Math.random()<0.5){
            this.x=Math.random()*this.game.width;
            this.y=Math.random()<0.5 ? -this.radius : this.game.height + this.radius;
        }else{
            this.x=Math.random()<0.5 ? -this.radius : this.game.width + this.radius;
            this.y=Math.random()*this.game.height;
        }

        /*
        this.x=Math.random()*this.game.width;
        this.y=Math.random()*this.game.height;
        */

        const aim=this.game.calcAim(this, this.game.planet);

        this.speedX=aim[0] * this.speedModifier;
        this.speedY=aim[1] * this.speedModifier;
        this.angle=Math.atan2(aim[3],aim[2])+Math.PI*0.5;
    }

    reset(){
        this.free=true;
    }

    hit(damage){
        this.lives -= damage;
        if(this.lives>=1) this.frameX++;
    }

    //only if its active
    draw(context){
        if(!this.free){
            context.save();
            context.translate(this.x,this.y);
            context.rotate(this.angle);
            context.drawImage(this.image, this.frameX * this.width,this.frameY * this.height,this.width,this.height,-this.radius, -this.radius, this.width, this.height);

            if(this.game.debug){
                context.beginPath();
                context.arc(0,0,this.radius,0,Math.PI*2);
                context.stroke();
                context.fillText(this.lives, 0, 0);
            }
            context.restore();

        }
    }

    update(context){

        if(!this.free){

            if(!this.game.isPaused){
                this.x+=this.speedX;
                this.y+=this.speedY;
            }

             //check collision enemy/planet

             if(this.game.checkCollision(this, this.game.planet) && this.lives >=1){
                 this.lives=0;
                 this.speedX=0;
                 this.speedY=0;
                 this.collided=true;
                 this.game.lives--;


             }

             //check collision enemy/player

             if(this.game.checkCollision(this, this.game.player) && this.lives >= 1 ){
                 this.lives=0;
                 this.collided=true;
                 this.game.lives--;

             }

             //check collision enemy/projectile
             this.game.projectilePool.forEach(projectile =>{
                 if(!projectile.free && this.game.checkCollision(this,projectile)&&this.lives >=1){
                     projectile.reset();
                     this.hit(1);
                 }
             });
             //sprite Animation 

             if(this.lives < 1 && this.game.spriteUpdate) {
                this.frameX++;
             }
             if(this.frameX > this.maxFrame){
                this.reset();
                //only add scores if collied is false
                if(!this.collided)
                this.game.score += this.maxLives;
             } 


         }

    }
}

class Alien extends Enemy{
    constructor(game){
        super(game);
        this.image=document.getElementById('alien');
        this.frameX=0;
        this.frameY= Math.floor(Math.random()*3);
        this.maxFrame=4;
        this.lives=3;
        this.maxLives=this.lives;
    }
}

class Lobstermorph extends Enemy{
    constructor(game){
        super(game);
        this.image=document.getElementById('lobstermorph');
        this.frameX=0;
        this.frameY= Math.floor(Math.random() * 4);
        this.maxFrame=14;
        this.lives=8;
        this.maxLives=this.lives;
    }
}




 class Game{
    constructor(canvas){
        this.canvas=canvas;
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.planet=new Planet(this);

        this.player= new Player(this);


        this.debug=false;

        this.projectilePool=[];

        this.numberOfProjectiles=20;
        this.createProjectilePool();

        this.enemyPool=[];
        this.numberOfEnemies=20;
        this.createEnemyPool();

        this.enemyPool[0].start();
        this.enemyTimer=0;
        this.enemyInterval=1000;


        this.spriteUpdate=false;
        this.spriteTimer=0;
        this.spriteInterval=100;


        this.isPaused = false;
        this.score=0;
        //adjust as needed 
        this.winningScore=50;
        this.lives=5;

        this.mouse = {
            x:0,
            y:0
        }

        //event listeners
        window.addEventListener('mousemove', e =>{
          //  console.log(e);
        if (!this.isPaused) {
            this.mouse.x=e.offsetX;
            this.mouse.y=e.offsetY;
        }

        });

        window.addEventListener('mousedown', e =>{
            //  console.log(e);
            if (!this.isPaused) {
              this.mouse.x=e.offsetX;
              this.mouse.y=e.offsetY;
              this.player.shoot();
            }

          });


        window.addEventListener('keyup', e => {
            if ( e.key ==='d') this.debug = !this.debug;
            else if(e.key === '1') this.player.shoot();

        });

        window.addEventListener('keyup', e => {
            if (e.key === 'q') this.togglePause();
        });

    }
    //könnte hier sein wegen den grössen 

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pauseOverlayShooter');
        pauseOverlay.style.display = this.isPaused ? 'flex' : 'none';
     
    }

    render(context, deltaTime){
        this.planet.draw(context);
        //this.planet.y--;
        this.drawStatusText(context);
        this.player.draw(context);
        this.player.update(context);

        this.projectilePool.forEach(projectile => {
            projectile.draw(context);
            projectile.update();
        })

        //we dont need this line
        /* context.moveTo(this.planet.x,this.planet.y);
        context.lineTo(this.mouse.x,this.mouse.y);
        context.stroke();
            //til here
        */



        this.enemyPool.forEach(enemy =>{
            enemy.draw(context);
            enemy.update();
        });
        //periodically activate an enemy
        
        if(!this.gameOver){

            if(this.enemyTimer < this.enemyInterval){
                this.enemyTimer += deltaTime;
            }else{
                this.enemyTimer=0;
                const enemy = this.getEnemy();
                if(enemy) enemy.start();
            }

        }
        

        
        
        //periodically update sprites
        if(this.spriteTimer < this.spriteInterval){
            this.spriteTimer += deltaTime;
            this.spriteUpdate = false;

        }else{

            this.spriteTimer=0;
            this.spriteUpdate=true;

        }
        //win/lose condition
        if(this.score >= this.winningScore || this.lives < 1 ){
            this.gameOver=true;
        }

    }

    drawStatusText(context){
        context.save();
        context.textAlign='left';
        //can be replaced with a google font 
        context.font='30px Impact';
        context.fillText('Score: ' + this.score, 20 , 30);
//draw player lives

        for (let i = 0; i < this.lives; i++) {
            context.fillRect(20 + 15 * i, 60, 10, 30 );
            
        }



        if(this.gameOver){
            context.textAlign='center';
            let message1;
            let message2;
        }
        context.restore();


    };
    calcAim(a,b){
        const dx = a.x - b.x;
        const dy  = a.y-b.y;
        const distance=Math.hypot(dx,dy);
        const aimX=dx/distance * -1;
        const aimY=dy/distance * -1;
        return[aimX, aimY, dx, dy];
    }

    checkCollision(a,b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx,dy);
        const sumOfRadii=a.radius + b.radius;

        //collide

        return distance < sumOfRadii;
    }

    createProjectilePool(){
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilePool.push(new Projectile(this));

        }
    }

    getProjectile(){
        for (let i = 0; i < this.projectilePool.length; i++) {
           if(this.projectilePool[i].free) return this.projectilePool[i];

        }
    }

    createEnemyPool(){
        for (let i = 0; i < this.numberOfEnemies; i++) {
            let randomNumber = Math.random();
            if(randomNumber > 0.25 ){
           this.enemyPool.push(new Alien (this));

            }
             else{

                this.enemyPool.push(new Lobstermorph(this));

             }

        }
    }

    getEnemy(){
        for (let i = 0; i < this.enemyPool.length; i++) {
            if(this.enemyPool[i].free) return this.enemyPool[i];

         }
     }

 }


window.addEventListener('load',function(){

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.5;
    canvas.height=900;

    ctx.strokeStyle='white';
    ctx.fillStyle='white';
    ctx.lineWidth=2;
    ctx.font='30px Helvetica';
    ctx.textAlign='center';
    ctx.textBaseline='middle';

    const pauseOverlayShooter = document.getElementById("pauseOverlayShooter");
    pauseOverlayShooter.style.width = canvas.width + "px";
    pauseOverlayShooter.style.height = canvas.height + "px";

    const game=new Game(canvas);

    let lastTime=0;
 
    function animate(timeStamp){
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);

    }

    setInterval(function() {
        game.togglePause();
    }, 15000);

    requestAnimationFrame(animate);

});