import SceneJam from '../lib/scenejamphaser.js'
import Phaser from 'phaser'

class LoadingScene extends Phaser.Scene {
    constructor () {
        super('loading')
    }

    preload () {
        // LOAD ASSETS HERE
        SceneJam.load_scenes(this)
    }

    create () {
        this.scene.start('menu')
    }
}

export { LoadingScene }
