import {
    App,
    ControlsManager,
    SceneManager,
    SunLight,
    Line,
    Plane,
    Stats
} from 'mage-engine';

import UI from './UI';

const GRID_SIZE = 1000;
const GRID_STEP = 100;
const OBSTACLE_SIZE = 15;
const SIZE = 20;

class Node {

  constructor(x, y, posX, posY) {
    this.x = x;
    this.y = y;
    this.posX = posX;
    this.posY = posY;

    this.isTarget = false;
    this.isChaser = false;
    this.isObstacle = false;
    this.gCost = 0;
    this.hCost = 0;
  }

  getFCost() {
    return (this.gCost + this.hCost);
  }

  equals(n) {
    return (
        this.x == n.x &&
        this.y == n.y &&
        this.posX === n.posX &&
        this.posY === n.posY);
  }

  clone() {
    const n = new Node(this.x, this.y, this.posX, this.posY);
    n.isTarget = this.isTarget;
    n.isChaser = this.isChaser;
    n.isObstacle = this.isObstacle;
    n.gCost = this.gCost;
    n.hCost = this.hCost;
    n.from = this.from;

    return n;
  }
}
export default class FlatGrid extends App {

    getPossiblePositions(max, size, _values, _boundary) {
        let values = _values || [];
        let boundary = _boundary || -max;
        values.push(max);

        if (max === boundary) return values;

        return this.getPossiblePositions(max - size, size, values, boundary);
    }

    createGrid(positions) {
        let grid = [];

        for (let x = 0; x < positions.length; x++) {
            grid.push([]);
            for (let y = 0; y < positions.length; y++) {
                grid[x].push(new Node(x, y, positions[x], positions[y]));
            }
        }

        return grid;
    }

    getRandomNode() {
        const size = this.grid[0].length;

        return this.grid[Math.floor(Math.random() * size)][Math.floor(Math.random() * size)];
    }

    getNeighbors(node) {
        const neighbors = [];
        const positions = [
            [node.x - 1, node.y - 1], [node.x, node.y - 1], [node.x + 1, node.y - 1],
            [node.x - 1, node.y], [node.x + 1, node.y],
            [node.x - 1, node.y + 1], [node.x, node.y + 1], [node.x + 1, node.y + 1]
        ];

        positions.forEach(p => {
            const n = this.grid[p[0]] && this.grid[p[0]][p[1]];
            if (n) neighbors.push(n);
        });

        return neighbors;
    }

  	createObstacles(amount) {
        this.obstacles = [];
        for (let i=0; i<amount; i++) {
            const node = this.getRandomNode();

            if (!node.equals(this.target) && !node.equals(this.chaser)) {
                const cube = this.sceneHelper.addCube(OBSTACLE_SIZE, 0x018786);
                const pos = {
                    x: node.posX,
                    y: 10,
                    z: node.posY,
                };

                node.isObstacle = true;

                cube.setMaterialFromName('lambert');
                cube.position(pos);
                this.obstacles.push(cube);
            }
        }
    }

    createTarget() {
        const node = this.getRandomNode();

        node.isTarget = true;
        return node;
    }

    createChaser() {
        const node = this.getRandomNode();

        node.isChaser = true;
        return node;
    }

    drawPlayer(node, color) {
        const sphere = this.sceneHelper.addSphere(OBSTACLE_SIZE/2, color);

        sphere.setMaterialFromName('lambert');
        sphere.position({
            x: node.posX,
            y: 10,
            z: node.posY
        });

        return sphere;
    }

    addAmbientLight() {
        const light = new SunLight({
            color: 0xeeeeee,
            intensity: 1,
            target: { x: 0, y: 0, z: 0 },
            name: 'sunlight'
        });

        light.position({ y: 300, z: -700 });

        return light;
    }

    distance(nodeA, nodeB) {
        const dstX = Math.abs(nodeA.x - nodeB.x);
        const dstY = Math.abs(nodeA.y - nodeB.y);

        if (dstX > dstY) return (14 * dstY + 10 * (dstX-dstY));

        return (14 * dstX + 10 * (dstY-dstX));
    }

    isNodeInSet(set, node) {
        set.find(n => (n.x === node.x && n.y === node.y));
    }

    getPath(start, goal) {
        const path = [];
        let current = goal;

        while (!current.equals(start)) {
            path.push(current);
            current = current.from;
        }

        path.reverse();

        return path;
    }

    drawPath(path) {
        const points = path.map(p => ({
            x: p.posX,
            y: 15,
            z: p.posY
        }));

        return new Line(points);
    }

    drawExplore() {
        this.explore.forEach((n) => {
            const plane = new Plane(SIZE, SIZE, { color: 0xbb86fc, transparent: true, opacity: 0.1 });
            plane.position({
                x: n.posX,
                y: -5,
                z: n.posY
            });
            plane.face({ x: n.posX, y: 1, z: n.posY });

            this.planes.push(plane);
        });
    }

    moveChaserAlongPath(chaser, path) {
        if (!path.length) return;

        const pos = path.shift();

        chaser.goTo({
            x: pos.posX,
            y: 10,
            z: pos.posY
        }, 1000)
        .then(() => {
            this.moveChaserAlongPath(chaser, path);
        });
    }

    astar(start, goal) {

		const openSet = [start];
		const closedSet = [];
        this.explore = [];

		while (openSet.length > 0) {
			let node = openSet[0];

			for (let i = 1; i < openSet.length; i ++) {
				if (openSet[i].getFCost() < node.getFCost() || openSet[i].getFCost() == node.getFCost()) {
					if (openSet[i].hCost < node.hCost)
						node = openSet[i];
				}
			}
            const nodeIndex = openSet.findIndex(n => node.equals(n));
            openSet.splice(nodeIndex, 1);

			closedSet.push(node);

			if (node.equals(goal)) {
   		       return;
			}

            const neighbors = this.getNeighbors(node);
            for (let i=0; i<neighbors.length; i++) {
                const neighbor = neighbors[i];

                if (neighbor.isObstacle || this.isNodeInSet(closedSet, neighbor)) {
                    continue;
                }

                const newCostToNeighbor = node.gCost + this.distance(node, neighbor);
                if (newCostToNeighbor < neighbor.gCost || !this.isNodeInSet(openSet, neighbor)) {
                    neighbor.gCost = newCostToNeighbor;
					neighbor.hCost = this.distance(neighbor, goal);
                    const clone = node.clone();
                    neighbor.from = clone;
                    this.explore.push(clone);

                    if (!this.isNodeInSet(openSet, neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
		}
    }

    clear() {
        this.linePath.destroy();
        this.chaserPlayer.destroy();
        this.targetPlayer.destroy();
        this.obstacles.forEach(o => o.destroy());
        this.planes.forEach(p => p.destroy());
    }

    start() {
        const positions = this.getPossiblePositions(GRID_SIZE/2, SIZE);
        this.grid = this.createGrid(positions);
        this.chaser = this.createChaser();
        this.target = this.createTarget();
        this.createObstacles(this.numObstacles);

        this.chaserPlayer = this.drawPlayer(this.chaser, 0xcf6679);
        this.targetPlayer = this.drawPlayer(this.target, 0x3700b3);

        this.astar(this.chaser, this.target);
        const path = this.getPath(this.chaser, this.target);
        this.linePath = this.drawPath(path);
        this.drawExplore();

        this.moveChaserAlongPath(this.chaserPlayer, path, this.target);
    }

    handleObstaclesChange = ({ target }) => {
        const { value } = target;

        this.numObstacles = parseInt(value);
    }

    handleWireframeChange = ({ target }) => {
        const { checked } = target;

        this.chaserPlayer.setWireframe(checked);
        this.targetPlayer.setWireframe(checked);
        this.obstacles.forEach(o => o.setWireframe(checked));
    }

    progressAnimation = (callback) => {
        const loader = document.querySelector('.loader');
        loader.classList.remove('fadeout', 'invisible');
        setTimeout(() => {
            loader.classList.add('fadeout');
        }, 5000);
        setTimeout(() => {
            loader.classList.add('invisible');
        }, 6000);
        callback();
    };

    setUpCamera = () => {
        SceneManager.camera.position({y: 300, z: 700});
        SceneManager.camera.lookAt(0, 0, 0);
    };

    setUpFloor = () => {
        const floor = this.sceneHelper.addCube(50, 0xeeeeee);

        floor.setMaterialFromName('lambert');
        floor.scale({ x: 50, y: 0.5, z: 50});
    };

    setUpWalls = () => {
        const positions = [
            {x: 100, z: 0},
            {x: 0, z: 100},
            {x: -100, z: 0},
            {x: 0, z: -100},
        ];

        const scales = [
            { x: 50, y: 2, z: 50},
            { x: 50, y: 2, z: 50},
            { x: 50, y: 2, z: 50},
            { x: 50, y: 2, z: 50}
        ];

        return positions.map( p => {
            
        })
    }

    onCreate() {
        /*
        this.numObstacles = 500;
        this.planes = [];

		this.enableInput();
        this.enableUI(UI, {
            fps: Stats.fps
        });
        */

        ControlsManager.setOrbitControl();
        SceneManager.setClearColor(0x222222);

        this.addAmbientLight();
        this.setUpCamera();

        this.setUpFloor();

        this.sceneHelper.addGrid(GRID_SIZE, GRID_STEP);
    }
}
