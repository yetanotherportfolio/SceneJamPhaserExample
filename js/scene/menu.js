
import SceneJam from '../lib/scenejamphaser.js'
import Phaser from 'phaser'

class MenuScene extends Phaser.Scene {
    constructor () {
        super('menu')
    }

    create () {
        SceneJam.init_scene(this, 'scene 1')

        const uigo = SceneJam.assets.uigo
        uigo.setInteractive()
        uigo.on('pointerdown', () => {
            uigo.play('down')
        })
        uigo.on('pointerup', () => {
            uigo.play('over')
            this.scene.start('game')
        })
        uigo.on('pointerover', () => {
            uigo.play('over')
        })
        uigo.play('idle').on('pointerout', () => {
            uigo.play('idle')
        })
    }
}

export { MenuScene }
