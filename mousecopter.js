
let app;
let mouseSprite;
let mousePlayer;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let fps = 60;
let frameDuration = 1000 / fps;
let accumulatedTime = 0;
let frameOffset = 0;
let lastUpdateTime = 0;

let initGame = () => {
	// PIXI
	app = new PIXI.Application({width: 500, height: 500, backgroundAlpha: 0.1});
	document.body.appendChild(app.view);
	mouseSprite = PIXI.Sprite.from("mouse.png");
	app.stage.addChild(mouseSprite);
	// Game
	mousePlayer = {
		x: 0,
		y: 0,
		xMomentum: 0,
		yMomentum: 0,
		canJump: true,
	};
	//Events
	addEventListener("keydown", keyDown);
	addEventListener("keyup", keyUp);
	// Game Loop
	requestAnimationFrame(update);
}
addEventListener("load", initGame);

let keyDown = (e) => {
	if (e.keyCode === 38) {
		upPressed = true;
	}
	if (e.keyCode === 40) {
		downPressed = true;
	}
	if (e.keyCode === 37) {
		leftPressed = true;
	}
	if (e.keyCode === 39) {
		rightPressed = true;
	}
}

let keyUp = (e) => {
	if (e.keyCode === 38) {
		upPressed = false;
	}
	if (e.keyCode === 40) {
		downPressed = false;
	}
	if (e.keyCode === 37) {
		leftPressed = false;
	}
	if (e.keyCode === 39) {
		rightPressed = false;
	}
}

let update = (currentTime) => {
	requestAnimationFrame(update);
	var frameDelta = currentTime - lastUpdateTime;
	if (frameDelta > 1000) {
		frameDelta = frameDuration;
	}
	accumulatedTime += frameDelta;
	if (accumulatedTime >= frameDuration) {
		updateGame();
	}
	updateRender();
	frameOffset = accumulatedTime / frameDuration;
	lastUpdateTime = currentTime;
}

let updateGame = () => {
	// Move left/right
	if (rightPressed) {
		mousePlayer.xMomentum += 0.5;
	}
	if (leftPressed) {
		mousePlayer.xMomentum -= 0.5;
	}
	// Jump
	if (upPressed) {
		if (mousePlayer.canJump) {
			mousePlayer.canJump = false;
			mousePlayer.yMomentum = -20;
		}
		else {
			// Hold jump while ascending
			if (mousePlayer.yMomentum < 0) {
				mousePlayer.yMomentum -= 0.4;
			}
		}
	}
	// Gravity
	mousePlayer.yMomentum += 0.6;
	// Friction
	mousePlayer.xMomentum *= 0.9;
	mousePlayer.yMomentum *= 0.9;
	// Collide with left/right edge
	if (mousePlayer.x < 0) {
		mousePlayer.x = 0;
		mousePlayer.xMomentum = 0;
	}
	if (mousePlayer.x > 450) {
		mousePlayer.x = 450;
		mousePlayer.xMomentum = 0;
	}
	// Land on ground
	if (mousePlayer.y > 450) {
		mousePlayer.y = 450;
		mousePlayer.yMomentum = Math.max(mousePlayer.yMomentum, 0);
		mousePlayer.canJump = true;
	}
	// Apply momentum
	mousePlayer.x += mousePlayer.xMomentum;
	mousePlayer.y += mousePlayer.yMomentum;
}

let updateRender = () => {
	mouseSprite.x = mousePlayer.x;
	mouseSprite.y = mousePlayer.y;
}