const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './images/Background/background2.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y: 168
	},
	imageSrc: './images/Background/shop.png',
	scale: 2.75,
	maxFrames: 6
})

const player = new Fighter({
	position: {
		x: 200,
		y: 0
	},
	velocity: {
		x: 0,
		y: 10
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './images/Martial Hero/Idle.png',
	scale: 2.5,
	maxFrames: 8,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imgSrc: './images/Martial Hero/Idle.png',
			maxFrames: 8
		},
		run: {
			imgSrc: './images/Martial Hero/Run.png',
			maxFrames: 8
		},
		jump: {
			imgSrc: './images/Martial Hero/Jump.png',
			maxFrames: 2
		},
		fall: {
			imgSrc: './images/Martial Hero/Fall.png',
			maxFrames: 2
		},
		attack1: {
			imgSrc: './images/Martial Hero/Attack1.png',
			maxFrames: 6
		},
		takeHit: {
			imgSrc: './images/Martial Hero/Take Hit - white silhouette.png',
			maxFrames: 4
		},
		death: {
			imgSrc: './images/Martial Hero/Death.png',
			maxFrames: 6
		}
	},
	attackBox: {
		offset: {
			x: 0,
			y: -25
		},
		width: 222,
		height: 160
	},
})

const enemy = new Fighter({
	position: {
		x: 800,
		y: 100
	},
	velocity: {
		x: 0,
		y: 10
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0
	},
	imageSrc: './images/Martial Hero 2/Idle.png',
	scale: 2.5,
	maxFrames: 4,
	offset: {
		x: -280,
		y: 173
	},
	sprites: {
		idle: {
			imgSrc: './images/Martial Hero 2/Idle.png',
			maxFrames: 4
		},
		run: {
			imgSrc: './images/Martial Hero 2/Run.png',
			maxFrames: 8
		},
		jump: {
			imgSrc: './images/Martial Hero 2/Jump.png',
			maxFrames: 2
		},
		fall: {
			imgSrc: './images/Martial Hero 2/Fall.png',
			maxFrames: 2
		},
		attack1: {
			imgSrc: './images/Martial Hero 2/Attack1.png',
			maxFrames: 4
		},
		takeHit: {
			imgSrc: './images/Martial Hero 2/Take hit.png',
			maxFrames: 3
		},
		death: {
			imgSrc: './images/Martial Hero 2/Death.png',
			maxFrames: 7
		}
	},
	attackBox: {
		offset: {
			x: -213,
			y: 0
		},
		width: 222,
		height: 140
	},
	reverse: -1

}
)

const keys = {
	q: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
}

decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update()
	shop.update()

	c.fillStyle = 'rgba(255,255,255,0.15)'
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	// player movement
	if (keys.q.pressed && player.lastKey === 'q') {
		player.velocity.x = -5
		// player.reverse = -1
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey == 'd') {
		player.velocity.x = 5
		// player.reverse = 1
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}

	// player Jump and Fall
	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
		enemy.velocity.x = 5
		enemy.switchSprite('run')
	} else {
		enemy.switchSprite('idle')
	}

	// enemy Jump and Fall
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	// detect for collision
	if (rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
	}) && player.isAttacking
		&& player.currentFrame === 4
	) {
		enemy.takeHit()
		player.isAttacking = false
		// document.querySelector('#enemyHealth').style.width = enemy.health + '%'
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
	}

	// If player misses attack
	if (player.isAttacking
		&& player.currentFrame === 4) {
		player.isAttacking = false
	}

	if (rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
	}) && enemy.isAttacking
		&& enemy.currentFrame === 2
	) {
		player.takeHit();
		enemy.isAttacking = false
		// document.querySelector('#playerHealth').style.width = player.health + '%'
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
	}

	// If player misses attack
	if (enemy.isAttacking
		&& enemy.currentFrame === 2) {
		enemy.isAttacking = false
	}

	// Fin du jeu
	if (player.health <= 0 || enemy.health <= 0) {
		determineWinner({ player, enemy, timerId })
	}
}

animate()

window.addEventListener('keydown', (event) => {

	if (player.dead === false) {
		switch (event.key) {
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break;
			case 'q':
				keys.q.pressed = true
				player.lastKey = 'q'
				break;
			case 'z':
				if (player.isInAir === false) {
					player.velocity.y = -20
					player.isInAir = true
				}
				break;
			case ' ':
				player.attack()
				break;
		}
	}

	if (enemy.dead === false) {
		switch (event.key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break;
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break;
			case 'ArrowUp':
				if (enemy.isInAir === false) {
					enemy.velocity.y = -20
					enemy.isInAir = true
				}
				break;
			case 'Enter':
				enemy.attack()
				break;
		}
	}
})

window.addEventListener('keyup', (event) => {

	// player keys
	switch (event.key) {
		case 'd':
			keys.d.pressed = false
			break;
		case 'q':
			keys.q.pressed = false
			break;
		case 'w':
			keys.w.pressed = false
			break;
	}

	// enemy keys
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break;
		case 'ArrowUp':
			keys.ArrowUp.pressed = false
			break;
	}
})