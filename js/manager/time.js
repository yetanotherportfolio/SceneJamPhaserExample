const DURATION = 120 * 1000

const TimerManager = {
    end_at: 0,
    ended: false,
    sprite: null,

    init: function (sprite) {
        this.end_at = Date.now() + DURATION
        this.ended = false
        this.sprite = sprite
    },

    update: function (cb) {
        if (this.ended) return

        const left = this.end_at - Date.now()
        if (this.end_at !== 0 && left <= 0) {
            this.sprite.setText('Time\'s up!')
            this.ended = true
            cb()
        } else {
            this.sprite.setText(`time: ${(left / 1000.0).toFixed(0)}`)
        }
    }
}
export default TimerManager
