class Control extends Script {

    constructor() {
        super('control');
    }

    start(mesh) {
      	Input.enable();
      	Input.addEventListener('keyDown', this.onKeyDown.bind(this));
        Input.addEventListener('keyUp', this.onKeyUp.bind(this));

      	this.mesh = mesh;
      	this.speed = 1;

        this.direction = {
            x: 0,
            y: 0,
            z: 0
        };
    }


  	onKeyDown(e) {
        this.direction = {
            x: Input.keyboard.isPressed('d') ? 1 : (Input.keyboard.isPressed('a') ?  -1 : 0),
            y: 0,
            z: Input.keyboard.isPressed('s') ? 1 : (Input.keyboard.isPressed('w') ?  -1 : 0),
        }
    }

  	onKeyUp(e) {
      	console.log(e);
    	const event = e.event;
      	switch (e.event.key) {
            case 'w':
                this.direction.z = 0;
                break;
            case 's':
                this.direction.z = 0;
                break;
            case 'a':
                this.direction.x = 0;
                break;
            case 'd':
                this.direction.x = 0;
                break;
        }
    }

    update(dt) {
        this.angle += 0.01;
      	const position = this.mesh.position();
        this.mesh.position({
        	x: position.x + (this.speed  * this.direction.x),
          	y: position.y + (this.speed  * this.direction.y),
        	z: position.z + (this.speed  * this.direction.z),
        });
    }
}
