class Movement extends Script {

    constructor() {
        super('movement');
    }

    start(mesh) {
      	// mesh is the element this script is attached to
      	Input.enable();
      	Input.addEventListener('keyDown', this.onKeyDown);
        Input.addEventListener('keyUp', this.onKeyUp);

      	this.mesh = mesh;
        this.angle = 0;
      	this.speed = 10;
      	this.running = {
        	x: false,
          	y: false,
          	z: false	
        }
    }
  
  
  	onKeyDown(e) {
    	const event = e.event;
      	switch (e.event.key) {
          case 'w':
            this.running.x = true;
            break;
        }
    }
  
  	onKeyUp(e) {
    	const event = e.event;
      	switch (e.event.key) {
          case 'w':
            this.running.x = false;
            break;
        }
    }

    update(dt) {
        this.angle += 0.01;
      	const position = this.mesh.position();
        this.mesh.position({
        	x: this.running.x ? position.x + this.speed : position.x,
          	y: this.running.y ? position.y + this.speed : position.y,
        	z: this.running.z ? position.z + this.speed : position.z,

        });
    }
}