const ScoreManager = {
    sprite: null,
    score: 0,

    init: function (sprite) {
        this.sprite = sprite
        this.update()
    },

    update: function () {
        this.sprite.setText(`score: ${this.score.toFixed(2)}`)
    },

    add: function (weight) {
        this.score += weight
        this.update()
    }
}

export default ScoreManager
