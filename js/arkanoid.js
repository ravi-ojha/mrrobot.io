//-----------------------------------------------------------------------------------------------------------
// Arkanoid game
//
// Author: delimitry
// Modified: ravi-ojha
//-----------------------------------------------------------------------------------------------------------

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

var BallDirs = {
	NONE : 0,
	LEFT : 1,
	RIGHT : 2,
	UP : 4,
	DOWN : 8
};

function Ball(x, y, radius, dir, speed) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dir = BallDirs.NONE;
	this.speed = speed;
}

var BricksTypes = {
	DEFAULT : 1,
};

function Brick(x, y, width, height, type) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.lifes = type;
}

var map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		   [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
		   [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
		   [1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
		   [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
		   [1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
		   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		  ]

function Bricks(hor_num, vert_num, brick_width, brick_height) {

	this.bricks = new Array();
	for (var i = 0; i < vert_num; i++) {
		this.bricks[i] = new Array();
		for (var j = 0; j < hor_num; j++) {
			this.bricks[i][j] = new Brick(j * brick_width, i * brick_height, brick_width, brick_height, BricksTypes.DEFAULT);
		}
	}
}

//-----------------------------------------------------------------------------------------------------------
// Arkanoid Game class
//-----------------------------------------------------------------------------------------------------------
function ArkanoidGame(canvas, context) {

	var PADDLE_WIDTH = 60;
	var PADDLE_HEIGHT = 10;
	var PADDLE_SPEED = 1;
	var BALL_RADIUS = 3;
	var BALL_DEFAULT_SPEED = 3;
	var BALL_MAX_SPEED = 6;
	var BRICK_WIDTH = 19;
	var BRICK_HEIGHT = 10;
	var BRICK_SCORE = 100;

	this.level = 0;
	this.lifes = 3;
	this.score = 0;
	this.paddle = new Paddle(canvas.width / 2 - PADDLE_WIDTH / 2, canvas.height - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
	this.ball = new Ball(canvas.width / 2, canvas.height / 2, BALL_RADIUS, BallDirs.NONE, BALL_DEFAULT_SPEED);
	this.gameOver = false;
	this.gameWin = false;
	this.gamePaused = false;
	this.bricks = new Bricks(8, 2, BRICK_WIDTH, BRICK_HEIGHT);

	this.init = function() {
		this.level = 0;
		this.lifes = 3;
		this.score = 0;
		this.gameOver = false;
		this.gameWin = false;
		this.gamePaused = false;
		this.ball.dir = BallDirs.NONE;
		this.initLevel(this.level);
	}

	this.initLevel = function(level) {
		switch (level) {
			case 0:
				this.bricks = new Bricks(35, 9, BRICK_WIDTH, BRICK_HEIGHT);
				for (var i = 0; i < this.bricks.bricks.length; i++) {
					for (var j = 0; j < this.bricks.bricks[i].length; j++) {
						if(map[i][j])
							this.bricks.bricks[i][j].lifes = BricksTypes.DEFAULT;
						else
							this.bricks.bricks[i][j].lifes = 0;
					}
				}
				break;

			default:
				break;
		}
	}

	this.drawBall = function() {
		context.beginPath();
		context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = '#2eec74';
		context.fill();
	}

	this.drawBricks = function() {
		for (var i = 0; i < this.bricks.bricks.length; i++) {
			for (var j = 0; j < this.bricks.bricks[i].length; j++) {
				if (this.bricks.bricks[i][j].lifes > 0) {
					switch (this.bricks.bricks[i][j].lifes) {
						case BricksTypes.DEFAULT: context.fillStyle = 'rgba(200, 212, 222, 0.7)'; break;
						default: context.fillStyle = '#2b3e51';
					}
					context.fillRect(this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width - 2, this.bricks.bricks[i][j].height - 2);
				}
			}
		}
	}

	this.draw = function() {
		context.fillStyle = '#2b3e51';
		context.fillRect(0, 0, canvas.width, canvas.height);

		this.drawBall();

		// draw paddle
		context.fillStyle = '#6cbef5';
		context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

		this.drawBricks();

		if (this.gamePaused && !this.gameWin && !this.gameOver) {
			context.fillStyle = '#2eec74';
			context.font = '20px Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New';
			context.fillText('Pause', canvas.width / 2 - 30, canvas.height / 2);
		}

		if (this.gameOver) {
			context.fillStyle = '#2eec74';
			context.font = '20px Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New';
			context.fillText('Game Over', canvas.width / 2 - 40, canvas.height / 2);
		}

		if (this.gameWin) {
			context.fillStyle = '#2eec74';
			context.font = '20px Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New';
			context.fillText('You Win', canvas.width / 2 - 40, canvas.height / 2);
		}

		context.fillStyle = '#fefefe';
		context.font = '12px Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New';
		context.fillText('Score: ' + this.score, 5, 300);

		context.fillStyle = '#fefefe';
		context.font = '12px Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New';
		context.fillText('Lives: ' + this.lifes, 5, 325);
	}

	this.update = function() {
		if (this.gamePaused || this.gameWin || this.gameOver) return;

		// update ball pos
		if (this.ball.dir & BallDirs.RIGHT) this.ball.x += this.ball.speed;
		else if (this.ball.dir & BallDirs.LEFT) this.ball.x -= this.ball.speed;
		if (this.ball.dir & BallDirs.UP) this.ball.y -= this.ball.speed;
		else if (this.ball.dir & BallDirs.DOWN) this.ball.y += this.ball.speed;

		// ball bounce from paddle
		if ((this.ball.x + this.ball.radius > this.paddle.x && this.ball.x - this.ball.radius < this.paddle.x + this.paddle.width) &&
			(this.ball.y + this.ball.radius > this.paddle.y)) {
			if (this.ball.speed < BALL_MAX_SPEED) this.ball.speed += 0.5;
			if (this.ball.dir & BallDirs.DOWN) {
				this.ball.dir = this.ball.dir - BallDirs.DOWN + BallDirs.UP;
			} else if (this.ball.dir & BallDirs.UP) {
			 	this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
			}
		}

		// update ball
		if (this.ball.x - this.ball.radius < 0) {
			this.ball.x = this.ball.radius;
			this.ball.dir = this.ball.dir - BallDirs.LEFT + BallDirs.RIGHT;
		}
		if (this.ball.x + this.ball.radius > canvas.width) {
			this.ball.x = canvas.width - this.ball.radius;
			this.ball.dir = this.ball.dir - BallDirs.RIGHT + BallDirs.LEFT;
		}
		if (this.ball.y - this.ball.radius < 0) {
			this.ball.y = this.ball.radius;
			this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
		}

		if (this.ball.y + this.ball.radius > canvas.height) {
			// lost one life
			this.lifes--;
			this.ball.speed = BALL_DEFAULT_SPEED;
			if (this.lifes == 0) {
				this.gameOver = true;
			} else {
				this.ball.x = canvas.width / 2;
				this.ball.y = canvas.height / 2;
				this.ball.dir = BallDirs.NONE;
			}
		}

		if (this.ball.dir == BallDirs.NONE) {
			this.ball.x = this.paddle.x + this.paddle.width / 2;
			this.ball.y = this.paddle.y - this.ball.radius * 2;
		}

		// bounces
		for (var i = 0; i < this.bricks.bricks.length; i++) {
			for (var j = 0; j < this.bricks.bricks[i].length; j++) {
				if (this.bricks.bricks[i][j].lifes > 0) {
					if (this.ball.dir == BallDirs.LEFT + BallDirs.UP) {
						if (this.isPointInRect(this.ball.x - this.ball.speed, this.ball.y - 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x + this.bricks.bricks[i][j].width + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.LEFT + BallDirs.RIGHT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x - 0, this.ball.y - this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y + this.bricks.bricks[i][j].height + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					} else if (this.ball.dir == BallDirs.LEFT + BallDirs.DOWN) {
						if (this.isPointInRect(this.ball.x - this.ball.speed, this.ball.y + 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x + this.bricks.bricks[i][j].width + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.LEFT + BallDirs.RIGHT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x - 0, this.ball.y + this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.DOWN + BallDirs.UP;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					} else if (this.ball.dir == BallDirs.RIGHT + BallDirs.UP) {
						if (this.isPointInRect(this.ball.x + this.ball.speed, this.ball.y - 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.RIGHT + BallDirs.LEFT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x + 0, this.ball.y - this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y + this.bricks.bricks[i][j].height + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					} else if (this.ball.dir == BallDirs.RIGHT + BallDirs.DOWN) {
						if (this.isPointInRect(this.ball.x + this.ball.speed, this.ball.y + 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.RIGHT + BallDirs.LEFT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x + 0, this.ball.y + this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.DOWN + BallDirs.UP;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					}
				}
			}
		}

		full_level_life = 0;
		for (var i = 0; i < this.bricks.bricks.length; i++) {
			for (var j = 0; j < this.bricks.bricks[i].length; j++) {
				full_level_life += this.bricks.bricks[i][j].lifes
			}
		}

		if (full_level_life == 0) {
			if (this.level < 3) {
				this.ball.dir = BallDirs.NONE;
				this.level++;
				this.initLevel(this.level);
			} else this.gameWin = true;
		}
	}


	this.isPointInRect = function(x, y, rect_x, rect_y, rect_width, rect_height) {
		if ((x > rect_x && x < rect_x + rect_width) &&
			(y > rect_y && y < rect_y + rect_height))
			return true;
		return false;
	}

	this.isBallIntersectBrick = function(i, j) {
		if ((this.ball.x + this.ball.radius > this.bricks.bricks[i][j].x &&
			this.ball.x - this.ball.radius < this.bricks.bricks[i][j].x + this.bricks.bricks[i][j].width) &&
			(this.ball.y + this.ball.radius > this.bricks.bricks[i][j].y &&
			this.ball.y - this.ball.radius < this.bricks.bricks[i][j].y + this.bricks.bricks[i][j].height))
			return true;
		return false;
	}

	this.render = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		this.update();
		this.draw();
	}

	this.togglePause = function() {
		this.gamePaused = !this.gamePaused;
	}

	this.movePaddleLeft = function() {
		if (this.paddle.x > 0)
			this.paddle.x -= 10 * PADDLE_SPEED;
	}

	this.movePaddleRight = function() {
		if (this.paddle.x < canvas.width - this.paddle.width)
			this.paddle.x += 10 * PADDLE_SPEED;
	}

	this.setPaddlePos = function(x) {
		if (this.gamePaused || this.gameWin || this.gameOver) return;
		if (x < 0) x = 0;
		if (x > canvas.width - this.paddle.width) x = canvas.width - this.paddle.width;
		this.paddle.x = x;
	}

	this.startGame = function() {
		if (this.gamePaused) return;
		if (this.ball.dir == BallDirs.NONE) {
			this.ball.dir = BallDirs.RIGHT + BallDirs.UP;
		}
	}
};


function getRandomRange(min, max) {
	return Math.random() * (max - min + 1) + min;
}

var arkanoidGame;

function render() {
	arkanoidGame.render();
}

function checkCanvasIsSupported() {
	canvas = document.getElementById("gameCanvas");
	canvas.width = 640;
	canvas.height = 360;
	canvas.style.cursor = "none";
	if (canvas.getContext) {
		context = canvas.getContext('2d');

		arkanoidGame = new ArkanoidGame(canvas, context);
		arkanoidGame.init();

		setInterval(render, 1000 / 60);
	} else {
		alert("Sorry, but your browser doesn't support a canvas.");
	}
}

var KeyCodes = {
	SPACE : 32,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
};

document.onkeydown = function(event) {
	var keyCode;
	if (event == null) {
		keyCode = window.event.keyCode;
	} else {
		keyCode = event.keyCode;
	}
	switch (keyCode) {
		case KeyCodes.SPACE:
			arkanoidGame.togglePause();
			break;
		case KeyCodes.LEFT:
			arkanoidGame.movePaddleLeft();
			break;
		case KeyCodes.RIGHT:
			arkanoidGame.movePaddleRight();
			break;
		case KeyCodes.UP:
			arkanoidGame.startGame();
			break;
		default:
			break;
	}
}
