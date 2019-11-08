import { Component } from 'inferno';

export default class UI extends Component {

    render() {

        const { scene } = this.props;

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
                        <label for="volume">obstsacles</label>
                        <input
                            type="range"
                            id="start"
                            name="volume"
                            min="10"
                            max="700" />
                    </div>
                    <div className="input">
                        <label for="wireframe">wireframe</label>
                        <input
                            type="checkbox"
                            id="start"
                            name="wireframe"
                            min="10"
                            max="700"/>
                    </div>

                    <span className='fps'>67</span>
                </div>
            </div>
        );
    }
}
