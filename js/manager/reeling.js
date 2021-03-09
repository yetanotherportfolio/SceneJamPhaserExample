import Phaser from 'phaser'
import FishManager from './fish.js'
import NotifManager from './notif.js'
import ScoreManager from './score.js'
import BreakManager from './break.js'

const MAX_STRESS = 0.8
const MAX_REEL_SPEED = 1.5
const FLUCTUATIONS = [200, 1333]

const ReelingManager = {
    fish_distance: 0,
    fish_weight: 0,
    reel_speed: 0,
    line_stress: 0,
    line_stress_per_tick: 0,
    fishgaugebar: null,
    linegaugebar: null,
    bar_width: 0,

    init (gaugegroupe) {
        this.fishgaugebar = gaugegroupe.getByName('fishgaugebar')
        this.linegaugebar = gaugegroupe.getByName('linegaugebar')
        this.bar_width = gaugegroupe.getByName('linegauge').width
    },

    start: function () {
        this.move_gaugebar(this.fishgaugebar, 1)
        this.move_gaugebar(this.linegaugebar, 0)

        this.line_stress = 0
        this.fish_distance = 100
        this.fish_weight = 10 + Math.random() * 79

        this.reel_speed = ((100 - this.fish_weight) / 100.0) * MAX_REEL_SPEED
        this.line_stress_per_tick = (this.fish_weight / 100.0) * MAX_STRESS
        this.fluctuation_fact = Phaser.Math.RND.between(FLUCTUATIONS[0], FLUCTUATIONS[1])
    },

    move_gaugebar: function (sprite, percent) {
        const startx = -(this.bar_width / 2) + 34
        sprite.x = startx + (360 * percent)
    },

    update: function (is_down, end_cb) {
        if (is_down) {
            const level = BreakManager.level / 100.0
            const fluctuation = (Math.sin(Date.now() / this.fluctuation_fact) + 1) / 2

            this.line_stress += this.line_stress_per_tick / level * (1 - fluctuation)
            if (this.line_stress >= 100) {
                this.line_stress = 100
                console.log('LINE BROKE')
                NotifManager.show('He got away...')
                FishManager.restart()
                end_cb()
            }
            this.move_gaugebar(this.linegaugebar, this.line_stress / 100.0)

            this.fish_distance -= this.reel_speed * (1.0 - level * 0.9) * fluctuation
            if (this.fish_distance <= 0) {
                this.fish_distance = 0
                console.log('You got it!')
                NotifManager.show('Fish is ' + this.fish_weight.toFixed(2) + 'kg')
                FishManager.restart()
                ScoreManager.add(this.fish_weight)
                end_cb()
            }
            this.move_gaugebar(this.fishgaugebar, this.fish_distance / 100.0)
        } else {
            this.line_stress -= this.line_stress_per_tick
            if (this.line_stress < 0) {
                this.line_stress = 0
            }
            this.move_gaugebar(this.linegaugebar, this.line_stress / 100.0)
        }
    }
}
export default ReelingManager
