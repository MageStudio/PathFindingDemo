import { Component } from 'inferno';

export default class UI extends Component {

    render() {
        const { scene } = this.props;

        return <div>
            <button onclick={scene.start.bind(scene)}>
                START
            </button>
        </div>;
    }
}
