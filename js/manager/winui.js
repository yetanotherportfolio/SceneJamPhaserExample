import SceneJam from '../lib/scenejamphaser.js'

const WinUIManager = {
    scene: null,
    sprite: null,

    init: function (scene) {
        this.scene = scene
    },

    show: function () {
        this.sprite = SceneJam.add_asset(this.scene, 'scene 2', 'winui')

        const gobtn = this.sprite.getByName('winuigo')
        gobtn.setInteractive()
        gobtn.on('pointerdown', () => {
            gobtn.tweens.click.play()
            this.scene.scene.start('menu')
        })
    }
}
export default WinUIManager
