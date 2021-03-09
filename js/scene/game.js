import Phaser from 'phaser'
import SceneJam from '../lib/scenejamphaser.js'
import FishManager from '../manager/fish.js'
import ReelingManager from '../manager/reeling.js'
import NotifManager from '../manager/notif.js'
import ScoreManager from '../manager/score.js'
import BreakManager from '../manager/break.js'
import TimerManager from '../manager/time.js'
import WinUIManager from '../manager/winui.js'

class GameScene extends Phaser.Scene {
    constructor () {
        super('game')
    }

    create () {
        SceneJam.init_scene(this, 'scene 2')

        NotifManager.init(SceneJam.assets.notiftext)
        FishManager.init()
        ScoreManager.init(SceneJam.assets.scoretext)
        TimerManager.init(SceneJam.assets.timetext)
        WinUIManager.init(this)

        this.gaugegroupe = SceneJam.assets.gaugegroupe

        ReelingManager.init(this.gaugegroupe)
        BreakManager.init(this.gaugegroupe)

        window.DEBUG.SceneJam = SceneJam
        window.DEBUG.fishgaugebar = this.gaugegroupe.getByName('fishgaugebar')
        window.DEBUG.linegaugebar = this.gaugegroupe.getByName('linegaugebar')
    }

    on_reeling_ended () {
        this.gaugegroupe.tweens.hide.play()
        SceneJam.assets.float.visible = true
        SceneJam.assets.water.visible = true
        SceneJam.assets.water_particle.visible = true
        SceneJam.assets.fishtrail.alpha = 0
    }

    update () {
        const gotone = FishManager.update()
        if (gotone) {
            ReelingManager.start()
            this.gaugegroupe.tweens.show.play()
            SceneJam.assets.float.visible = false
            SceneJam.assets.water.visible = false
            SceneJam.assets.water_particle.visible = false
            SceneJam.assets.fishtrail.alpha = 1
        }

        if (FishManager.is_reeling) {
            ReelingManager.update(
                this.input.activePointer.isDown,
                () => {
                    this.on_reeling_ended()
                }
            )
        }

        NotifManager.update()

        TimerManager.update(() => {
            console.log('GAME ENDED WITH', ScoreManager.score)
            FishManager.stop()
            this.on_reeling_ended()
            WinUIManager.show()
        })
    }
}

export { GameScene }
