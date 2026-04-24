class Preload extends Phaser.Scene {
    constructor() {
        super('preload');
    }
    preload(){
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        //make progress bar
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0xffffff, 0.5);
        progressBox.fillRoundedRect(centerX - 160, centerY - 15, 320, 30, 10);

        let progressBar = this.add.graphics();

        let loadingText = this.add.text(centerX, centerY - 50, 'loading...', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let percentText = this.add.text(centerX, centerY, '0%', {
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(1);

        //change percent bar
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x8F88CF, 1);
            progressBar.fillRoundedRect(centerX - 155, centerY - 10, 310 * value, 20, 8);
        });


        this.load.on('complete', () => {
            loadingText.setText('Ready! (๑>◡<๑)');
            let clickText = this.add.text(centerX, centerY + 60 , 'Click to continue!', {
            fontSize: '15px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

            this.input.once("pointerdown", () => {
               this.scene.start('intro'); 
            })
        });
       
        //logo animation frames
        this.load.path = 'assets/logoAnimation/';
        for (let i = 1; i <=34; i++){
            this.load.image("logo-" + i, "logo-" + i + ".png");
        }

        //load images
        this.load.path = 'assets/images/';
        this.load.image('rain', 'rain.png');
        this.load.image('Coffee_and_Tea_Shop', 'Coffee_and_Tea_Shop.jpg');
        this.load.image('cafeInside', 'cafeInside.jpg');
        this.load.image('wood', 'wood.png');

        //load sounds
        this.load.path = 'assets/sounds/';
        this.load.audio('pop', 'pop.mp3');
        this.load.audio('bell', 'bell.mp3');
        this.load.audio('cafeMusic', 'cafeMusic.mp3');
        this.load.audio('rain', 'rain.mp3');

        //menu animation frames
        this.load.path = 'assets/menuAnimation/';
        for (let i = 1; i <=36; i++){
            this.load.image("menu-" + i, "menu-" + i + ".png");
        } 
        
    }
    create(){
        //this.scene.start('intro');
    }  
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro');
    }
    create(){
        this.sound.unlock(); //unlocks sound so audio can play at the correct time/frames

        //sets screen center
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        //create animation frames for logo animation
        let frameNames = [];
        for (let i = 1; i <= 34; i++){
            frameNames.push({key: "logo-" + i});
        }

        this.anims.create({
            key: "logoAnim",
            frames: frameNames,
            frameRate: 10,
            repeat: 0
        });

        let logo = this.add.sprite(centerX-10, centerY, "logo-1");
        logo.setScale(0.28);
        logo.setDepth(10);
        logo.play("logoAnim");

        // Play sounds during animation
        logo.on('animationupdate', (animation, frame) => {
            if (frame.index === 15) {
                this.sound.play('pop');
            }
            if (frame.index === 29) {
                this.sound.play('pop');
            }
        });

        //when the logo animation is done, add in text to move onto next scene
        logo.on("animationcomplete", () => {
            let nextScene = this.add.text(centerX, centerY + 255, "click to continue (๑>◡<๑)", {
                fontSize: "25px",
                color: "#ffffff",
            });
            this.sound.play('bell');
            nextScene.setOrigin(0.5);
            this.input.once("pointerdown", () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.cameras.main.on("camerafadeoutcomplete", () => {
                    this.scene.start("outside");
                });
            });
        });

        //create window background and frame
        const windowFrame = this.add.rectangle(centerX, centerY, 650, 450, 0xffffff);
        const windowBackground = this.add.rectangle(centerX, centerY, 620, 420, 0x1F2647, 0.8);

        // Draw window panes
        this.pane = this.add.graphics();
        this.pane.setDepth(5);
        this.pane.lineStyle(10, 0xffffff);

        this.pane.lineBetween(centerX - 155, centerY - 210, centerX - 155, centerY + 210);
        this.pane.lineBetween(centerX + 155, centerY - 210, centerX + 155, centerY + 210);

        this.pane.lineBetween(centerX - 310, centerY - 105, centerX + 310, centerY - 105);
        this.pane.lineBetween(centerX - 310, centerY + 105, centerX + 310, centerY + 105);


    }
    update(){
    
    }
}

class Outside extends Phaser.Scene {
    constructor() {
        super('outside');
    }
    create(){
        this.cameras.main.setBackgroundColor('#ACBDAD');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;


        this.add.image(575, centerY, 'Coffee_and_Tea_Shop').setScale(0.82);
        let text1 = this.add.text(20, centerY - 170, "It’s a quiet, cozy evening. Rain falls gently against the window of the local cafe. You decide to enter to get a warm drink.",{
            fontSize: "20px",
            color: "#000000",
            wordWrap: { width: 230 },
            align: 'center'
        });

        let cafeButton = this.add.ellipse(135, centerY + 100, 230, 60, 0xBDACBC).setInteractive();
        let buttonText = this.add.text(135, centerY + 100, "Enter the cafe", {
            fontSize: "20px",
            color: "#000000"
        }).setOrigin(0.5);

        cafeButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.on("camerafadeoutcomplete", () => {
                this.sound.stopByKey('rain');
                this.scene.start("inside");
            });
        });

        this.tweens.add({
            targets: [cafeButton, buttonText],
            scale: 1.03,    
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.sound.play('rain', { loop: true, volume: 0.5 });

    }
    update(){
    
    }
}

class Inside extends Phaser.Scene {
    constructor() {
        super('inside');
    }
    create(){
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.cameras.main.setBackgroundColor('#000000'); 
        this.add.image(centerX, centerY, 'cafeInside').setScale(0.8);

        this.sound.play('cafeMusic', { loop: true, volume: 0.5 });

        let text2 = this.add.text(centerX - 225, centerY + 195, "The smell of freshly ground coffee beans fills the air. As you settle into your seat, you open the menu, ready to choose your next flavorful adventure.",{
            fontSize: "16px",
            color: "#000000",
            wordWrap: { width: 480 },
            align: 'center'
        });
        text2.setDepth(10);

        //create background for text
        let backgroundOutline = this.add.ellipse(centerX, centerY + 220, 565, 125, 0xffffff);
        let textBackground = this.add.ellipse(centerX, centerY + 220, 550, 110, 0xBDACBC);

        //go to next scene
        this.time.delayedCall(10000, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.on("camerafadeoutcomplete", () => {
                this.scene.start("menu");
            });
        });


    }
    update(){
    
    }
}

class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    create(){

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.image(centerX, centerY, 'wood').setScale(0.5);

        //play animation when player clicks on menu/sprite image
        let menuFrames = [];
        for (let i = 1; i <= 36; i++){
            menuFrames.push({key: "menu-" + i});
        }

        this.anims.create({
            key: "menuAnim",
            frames: menuFrames,
            frameRate: 10,
            repeat: 0
        });

        let menu = this.add.sprite(centerX+20, centerY, "menu-1");
        menu.setInteractive();
        menu.on("pointerdown", () => {
            menu.play("menuAnim");
        });
        menu.setScale(0.55);
        menu.setDepth(10);

        let menuText = this.add.text(centerX + 60, 550, "Click menu to open",{
            fontSize: "16px",
            color: "#ffffff"
        });
        menuText.setDepth(10);

        //only show buttons after animation is done
        menu.on("animationcomplete", () => {
            menuText.setVisible(false);

            let button1 = this.add.rectangle(centerX + 135, centerY - 150, 170, 40, 0xF8D1A0).setInteractive();
            let buttonText1 = this.add.text(centerX + 135, centerY - 150, "Start", {
                fontSize: "20px",
                color: "#000000"
            }).setOrigin(0.5);
            button1.setDepth(10);
            buttonText1.setDepth(10);

            let button2 = this.add.rectangle(centerX + 135, centerY - 80, 170, 40, 0xF8D1A0).setInteractive();
            let buttonText2 = this.add.text(centerX + 135, centerY - 80, "Options", {
                fontSize: "20px",
                color: "#000000"
            }).setOrigin(0.5);
            button2.setDepth(10);
            buttonText2.setDepth(10);

            let button3 = this.add.rectangle(centerX + 135, centerY, 170, 40, 0xF8D1A0).setInteractive();
            let buttonText3 = this.add.text(centerX + 135, centerY, "Credits", {
                fontSize: "20px",
                color: "#000000"
            }).setOrigin(0.5);
            button3.setDepth(10);
            buttonText3.setDepth(10);

            let button4 = this.add.rectangle(centerX + 135, centerY + 80, 170, 40, 0xF8D1A0).setInteractive();
            let buttonText4 = this.add.text(centerX + 135, centerY + 80, "Quit", {
                fontSize: "20px",
                color: "#000000"
            }).setOrigin(0.5);
            button4.setDepth(10);
            buttonText4.setDepth(10);

            button1.on("pointerdown", () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.sound.stopAll();
            });

            button2.on("pointerdown", () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.sound.stopAll();
            });

            button3.on("pointerdown", () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.cameras.main.on("camerafadeoutcomplete", () => {
                    this.scene.start("credits");
                    this.sound.stopAll();
                });
            });

            button4.on("pointerdown", () => {
                window.close();
            });


        });

    }
    update(){
    
    }
}

class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }
    create(){
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        let creditsTitle = this.add.text(85, 40, "Credits:", {
            fontSize: "30px",
            color: "#000000"
        }).setOrigin(0.5);

        const createCredit = (y, title, linkUrl) => {
            this.add.text(40, y, title, {
                fontSize: "16px",
                color: "#000000"
            }).setOrigin(0, 0.5);

            // Clickable Link
            let link = this.add.text(40, y + 25, "Source Link", {
                fontSize: "14px",
                color: "#ffffff",
                textDecoration: 'underline'
            }).setOrigin(0, 0.5);

            link.setInteractive({ useHandCursor: true });
            link.on('pointerdown', () => window.open(linkUrl, '_blank'));
         
        };

        createCredit(80, "Cafe Background Art - Rainee.rainy", "https://www.instagram.com/p/CxCtCO4Pji_/");
        createCredit(140, "Cafe BGM - Denis-Pavlov-Music", "https://pixabay.com/music/smooth-jazz-cozy-relax-jazz-podcast-coffee-ambiance-271621/");
        createCredit(200, "Cafe Inside Background - Vecteezy", "https://www.vecteezy.com/vector-art/36155331-pixel-art-illustration-coffeeshop-background");
        createCredit(260, "Small Bell SFX - OxidVideos", "https://pixabay.com/sound-effects/film-special-effects-ding-small-bell-sfx-233008/");
        createCredit(320, "Gentle Rain - DRAGON-STUDIO", "https://pixabay.com/sound-effects/nature-gentle-rain-07-437321/");
        createCredit(380, "Pop SFX - u_8e8ungop1x", "https://pixabay.com/sound-effects/film-special-effects-pop-268648/");
    }
    update(){
    
    }
}

let config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: "root",
    backgroundColor: "#88A4CF",
    scene: [Preload, Intro, Outside, Inside, Menu, Credits]
}

let game = new Phaser.Game(config);