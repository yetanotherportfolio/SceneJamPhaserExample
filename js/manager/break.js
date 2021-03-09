const BREAKSTEP = 10

const BreakManager = {
    level: 50,

    breakup: null,
    breakdown: null,
    breaktext: null,

    init: function (gaugegroupe) {
        this.breakup = gaugegroupe.getByName('breakup')
        this.breakdown = gaugegroupe.getByName('breakdown')
        this.breaktext = gaugegroupe.getByName('breaktext')
        this.update()

        this.breakup.setInteractive()
        this.breakup.on('pointerdown', () => {
            this.update_level(true)
            this.breakup.tweens.click.play()
        })

        this.breakdown.setInteractive()
        this.breakdown.on('pointerdown', () => {
            this.update_level(false)
            this.breakdown.tweens.click.play()
        })
    },

    update_level: function (is_up) {
        if (is_up) {
            this.level += BREAKSTEP
        } else {
            this.level -= BREAKSTEP
        }
        this.level = Math.min(100, Math.max(0, this.level))
        this.update()
    },

    update: function () {
        this.breaktext.setText(`${this.level}%`)
    }
}
export default BreakManager
