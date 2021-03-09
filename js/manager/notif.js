const NotifManager = {
    sprite: null,
    time: null,
    start: null,

    duration: 2500.0,

    init: function (sprite) {
        this.sprite = sprite
    },

    show: function (text) {
        this.sprite.setText(text)
        this.sprite.alpha = 0.5
        this.time = Date.now() + this.duration
        this.start = Date.now()
    },

    update: function () {
        if (Date.now() >= this.time) {
            this.sprite.alpha = 0
        } else {
            this.sprite.alpha = 1.0 - ((Date.now() - this.start) / this.duration)
        }
    }
}
export default NotifManager
