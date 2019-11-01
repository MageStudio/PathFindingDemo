import { App, ControlsManager, SceneManager } from 'mage-engine';

export default class Marco extends App {

    getPossiblePositions(max, size, _values, _boundary) {
        let values = _values || [];
        let boundary = _boundary || -max;
        values.push(max);

        if (max === boundary) return values;

        return this.getPossiblePositions(max - size, size, values, boundary);
    }

  	createObstacles(amount) {
        const positions = this.getPossiblePositions(80, 20);
        const assigned = [];

        for (let i=0; i<amount; i++) {
            const cube = this.sceneHelper.addCube(20, 0x27ae60, { wireframe: false });
            const pos = {
                x: positions[Math.floor(Math.random() * positions.length)],
                y: 10,
                z: positions[Math.floor(Math.random() * positions.length)],
            };

            assigned.push(pos);
            cube.position(pos);
        }

        return assigned;
    }

    onCreate() {
		this.enableInput();

     	ControlsManager.setOrbitControl();

        SceneManager.setClearColor(0x2c3e50);
     	SceneManager.camera.position({y: 70, z: 150});
        SceneManager.camera.lookAt(0, 0, 0);

        this.createObstacles(20);

      	this.sceneHelper.addGrid(1000, 100);
    }
}
