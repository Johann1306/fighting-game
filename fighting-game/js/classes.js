class Sprite {
	constructor({
		position,
		imageSrc,
		scale = 1,
		maxFrames = 1,
		offset = { x: 0, y: 0 },
		reverse = 1
	}) {
		this.position = position
		this.height = 150
		this.width = 70
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.maxFrames = maxFrames
		this.currentFrame = 0
		this.framesElapsed = 0
		this.framesHold = 5
		this.offset = offset
		this.reverse = reverse
	}

	animateFrames() {
		this.framesElapsed++
		if (this.framesElapsed % this.framesHold === 0) {
			if (this.currentFrame < this.maxFrames - 1) {
				this.currentFrame++
			} else {
				this.currentFrame = 0
			}
		}
	}

	draw() {
		c.drawImage(
			this.image,
			// image cut
			this.currentFrame * (this.image.width / this.maxFrames),
			0,
			this.image.width / this.maxFrames,
			this.image.height,
			// image position
			(this.position.x - this.offset.x) * this.reverse,
			this.position.y - this.offset.y,
			this.image.width * this.scale / this.maxFrames,
			this.image.height * this.scale
		)
	}

	update() {
		this.draw()
		this.animateFrames()
	}
}

class Fighter extends Sprite {
	constructor({
		position,
		velocity,
		color = 'red',
		imageSrc,
		scale = 1,
		maxFrames = 1,
		offset = { x: 0, y: 0 },
		sprites,
		attackBox = {
			offset: {},
			width: undefined,
			height: undefined

		},
		reverse = 1
	}) {
		super({
			position,
			imageSrc,
			scale,
			maxFrames,
			offset,
			reverse
		})
		this.velocity = velocity
		// this.height = this.image.height
		// this.width = this.image.width / this.maxFrames
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		}
		this.color = color
		this.isAttacking
		this.isInAir = false
		this.health = 100
		this.currentFrame = 0
		this.framesElapsed = 0
		this.framesHold = 5
		this.sprites = sprites
		this.dead = false

		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imgSrc
		}
	}

	update() {
		this.attackBox.position.x = this.position.x + (this.width / 2) + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y


		// Draw attackBox
		// c.fillStyle = 'black'
		// c.fillRect(
		// 	this.position.x,
		// 	this.position.y,
		// 	this.width,
		// 	this.height
		// )

		// c.fillStyle = 'red'
		// c.fillRect(
		// 	this.attackBox.position.x,
		// 	this.attackBox.position.y,
		// 	this.attackBox.width,
		// 	this.attackBox.height
		// )

		// this.draw()
		this.flipHorizontally(this.image, 0, 0)
		if (this.dead === false) {
			this.animateFrames()
		}

		// this.position.x += this.velocity.x * this.reverse
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Gravity
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 55) {
			this.velocity.y = 0
			this.position.y = 371
			this.isInAir = false
		} else this.velocity.y += gravity

	}

	attack() {
		this.switchSprite('attack1')
		this.isAttacking = true
		// setTimeout(() => {
		// 	this.isAttacking = false
		// }, 1000);
	}

	takeHit() {
		this.health -= 20

		if (this.health <= 0) {
			this.switchSprite('death')
		} else {
			this.switchSprite('takeHit')
		}
	}

	switchSprite(sprite) {

		// Override others animations when fighter death
		if (this.image === this.sprites.death.image) {
			if (this.currentFrame === this.sprites.death.maxFrames - 1) {
				this.dead = true
			}
			return
		}

		// Override others animations when fighter attack
		if (this.image === this.sprites.attack1.image && this.currentFrame < this.sprites.attack1.maxFrames - 1) return

		// Override others animations when fighter get hit
		if (this.image === this.sprites.takeHit.image && this.currentFrame < this.sprites.takeHit.maxFrames - 1) return

		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image
					this.maxFrames = this.sprites.idle.maxFrames
					this.currentFrame = 0
				}
				break
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image
					this.maxFrames = this.sprites.run.maxFrames
					this.currentFrame = 0
				}
				break
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image
					this.maxFrames = this.sprites.jump.maxFrames
					this.currentFrame = 0
				}
				break
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image
					this.maxFrames = this.sprites.fall.maxFrames
					this.currentFrame = 0
				}
				break
			case 'attack1':
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image
					this.maxFrames = this.sprites.attack1.maxFrames
					this.currentFrame = 0
				}
				break
			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image
					this.maxFrames = this.sprites.takeHit.maxFrames
					this.currentFrame = 0
				}
				break
			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image
					this.maxFrames = this.sprites.death.maxFrames
					this.currentFrame = 0
				}
				break
		}

	}

	flipHorizontally(img, x, y) {
		// move to x + img's width
		//  c.translate(this.position.x + this.width, y);

		// scaleX by -1; this "trick" flips horizontally
		c.scale(this.reverse, 1);

		// draw the img
		// no need for x,y since we've already translated
		this.draw()

		// always clean up -- reset transformations to default
		c.setTransform(1, 0, 0, 1, 0, 0);
	}
}