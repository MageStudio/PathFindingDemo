import { Component } from 'inferno';

export default class UI extends Component {

    render() {
        const { scene } = this.props;

        return <div>
            <h1 className='title'>A*</h1>
            <button onclick={scene.start.bind(scene)}>START</button>
            <button onclick={scene.clear.bind(scene)}>CLEAR</button>
        </div>;
    }
}
