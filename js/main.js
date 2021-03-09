import { PreLoadingScene } from './scene/preloading.js'
import { LoadingScene } from './scene/loading.js'
import { MenuScene } from './scene/menu.js'
import { GameScene } from './scene/game.js'
import Phaser from 'phaser'

const config = {
    type: Phaser.WEBGL,
    width: 500,
    height: 500,
    parent: 'container',
    backgroundColor: '#1a5fb4',

    /* physics: {
        default: 'matter',
    }, */

    // ref: https://www.youtube.com/watch?v=gFXx7lgxK9A
    scene: [PreLoadingScene, LoadingScene, MenuScene, GameScene]
}

const game = new Phaser.Game(config)

// FOR DEBUGING ONLY
window.DEBUG = { game: game }
