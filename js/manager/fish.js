import NotifManager from './notif'

const MIN_WAIT = 2000
const MAX_WAIT = 8000

const FishManager = {
    next_fish_date: null,
    is_reeling: false,
    first_cast: true,
    ended: false,

    init: function () {
        this.is_reeling = false
        this.first_cast = true
        this.ended = false
        this.reroll_next_fish()
    },

    restart: function () {
        this.reroll_next_fish()
        this.is_reeling = false
    },

    reroll_next_fish: function () {
        if (this.ended) return

        if (this.first_cast) {
            this.first_cast = false
            this.next_fish_date = Date.now() + MIN_WAIT
        } else {
            this.next_fish_date = Date.now() + MIN_WAIT + Math.random() * MAX_WAIT
        }
    },

    update: function () {
        if (this.ended) return

        if (!this.is_reeling && Date.now() >= this.next_fish_date) {
            console.log('FISSSH')
            NotifManager.show('REEL!')
            this.is_reeling = true
            return true
        }
        return false
    },

    stop: function () {
        this.is_reeling = false
        this.ended = true
    }
}
export default FishManager
