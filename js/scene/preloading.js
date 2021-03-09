import SceneJam from '../lib/scenejamphaser.js'
import Phaser from 'phaser'

class PreLoadingScene extends Phaser.Scene {
    constructor () {
        super('preloading')
    }

    preload () {
        SceneJam.load_cfg(this, './assets/scenecfg.json')
    }

    create () {
        this.scene.start('loading')
    }
}

export { PreLoadingScene }
