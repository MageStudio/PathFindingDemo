import { Component } from 'inferno';
import { Stats } from 'mage-engine';

export default class UI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fps: Stats.fps
        };
        this.interval = undefined;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                fps: Stats.fps,
                obstacles: this.props.scene.numObstacles
            });
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        const { scene } = this.props;
        const { fps, obstacles } = this.state;

        const displayFPS = Math.floor(fps);

        return (
            <div>
                <div className='triangle'></div>
                <div className='elements'>
                    <h1>A*</h1>
                    <button
                        onclick={scene.start.bind(scene)}
                        className='start'>
                        start
                    </button>
                    <button
                        onclick={scene.clear.bind(scene)}
                        className='clear'>
                        clear
                    </button>

                    <div className="input">
                        <label for="volume">obstacles {obstacles}</label>
                        <input
                            onChange={scene.handleObstaclesChange.bind(scene)}
                            type="range"
                            id="start"
                            name="volume"
                            min="100"
                            max="700" />
                    </div>
                    <div className="input">
                        <label for="wireframe">wireframe</label>
                        <input
                            onChange={scene.handleWireframeChange.bind(scene)}
                            type="checkbox"
                            id="start"
                            name="wireframe"
                            min="10"
                            max="700"/>
                    </div>

                    <span className='fps'>{displayFPS}</span>
                </div>
            </div>
        );
    }
}