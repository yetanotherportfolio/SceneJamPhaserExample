const SceneJam = {
    assets: {},

    load_cfg: function (scene, path) {
        scene.load.json('scenecfg', path)
    },

    load_asset: function (scene, cfg) {
        if ((cfg.type === 'image' || cfg.type === 'particle') && cfg.src) {
            scene.load.image(
                cfg.name,
                cfg.src
            )
            return true
        } else if (cfg.type === 'sprite' && cfg.src) {
            // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Loader.FileTypes.html#.ImageFrameConfig
            const frame_cfg = { frameWidth: Number.MAX_VALUE }
            const _w = parseInt(cfg.width, 10)
            if (_w !== 0) {
                frame_cfg.frameWidth = _w
            }
            const _h = parseInt(cfg.height, 10)
            if (_h !== 0) {
                frame_cfg.frameHeight = _h
            }

            // https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#spritesheet__anchor
            scene.load.spritesheet(
                cfg.name,
                cfg.src,
                frame_cfg
            )
            return true
        } else if (cfg.type === 'container') {
            for (const i in cfg.assets) {
                this.load_asset(scene, cfg.assets[i])
            }
            return true
        }

        return false
    },

    load_scenes: function (scene) {
        const scenecfg = scene.cache.json.get('scenecfg')
        for (const scene_id in scenecfg.scenes) {
            const scene_info = scenecfg.scenes[scene_id]
            for (const i in scene_info.assets) {
                const asset = scene_info.assets[i]
                this.load_asset(scene, asset)
            }
        }
    },

    _add_asset: function (cfg, scene, is_loading) {
        if (is_loading && cfg.load_only) return

        let asset = null
        if (cfg.type === 'image') {
            asset = scene.add.image(cfg.x, cfg.y, cfg.name)
        } else if (cfg.type === 'sprite') {
            asset = scene.add.sprite(cfg.x, cfg.y, cfg.name)
        } else if (cfg.type === 'anchor') {
            asset = scene.add.image(cfg.x, cfg.y, 'editor-arrows')
        } else if (cfg.type === 'container') {
            asset = scene.add.container(cfg.x, cfg.y)
            for (const i in cfg.assets) {
                const _asset = this._add_asset(cfg.assets[i], scene, is_loading)
                asset.add([_asset])
            }
        } else if (cfg.type === 'text') {
            asset = scene.add.text(cfg.x, cfg.y, cfg.text, cfg.style)
        } else if (cfg.type === 'particle') {
            asset = scene.add.particles(cfg.name)

            const emiterParams = {
                x: cfg.x,
                y: cfg.y
            }
            Object.assign(emiterParams, cfg)
            Object.assign(emiterParams, cfg.params)

            asset.createEmitter(emiterParams)
        }

        if (asset) {
            if (cfg.type === 'anchor') {
                asset.setOrigin(0.5)
            } else if (asset.setOrigin !== undefined) {
                asset.setOrigin(
                    parseFloat('' + (cfg.originX || 0)),
                    parseFloat('' + (cfg.originY || 0))
                )
            }

            asset.flipX = cfg.flipX
            asset.flipY = cfg.flipY

            if (cfg.depth) asset.depth = cfg.depth
            if (cfg.scaleX !== undefined) asset.scaleX = cfg.scaleX
            if (cfg.scaleY !== undefined) asset.scaleY = cfg.scaleY
            if (cfg.alpha !== undefined) asset.alpha = cfg.alpha
            if (cfg.visible === false) asset.visible = false
            if (cfg.angle !== undefined) asset.angle = cfg.angle
            if (cfg.animations) {
                for (const anim_key in cfg.animations) {
                    const anim = cfg.animations[anim_key]

                    asset.anims.create({
                        key: anim_key,
                        frames: asset.anims.generateFrameNumbers(
                            cfg.name,
                            // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Animations.html#.GenerateFrameNumbers
                            {
                                frames: anim.frames
                            }
                        ),
                        frameRate: parseInt(anim.frameRate, 10),
                        repeat: parseInt(anim.repeat, 10)
                    })
                }

                if (cfg.start_anim !== undefined) {
                    const anim = asset.anims.get(cfg.start_anim)
                    if (anim && anim.frames.length) {
                        asset.play(cfg.start_anim)
                    }
                }
            }
            if (cfg.tweens) {
                asset.tweens = {}
                for (const tween_id in cfg.tweens) {
                    const tween_cfg = {}
                    Object.assign(tween_cfg, cfg.tweens[tween_id])
                    tween_cfg.targets = asset
                    tween_cfg[tween_cfg.param] = {}
                    if (!isNaN(tween_cfg.from)) tween_cfg[tween_cfg.param].from = tween_cfg.from
                    if (!isNaN(tween_cfg.to)) tween_cfg[tween_cfg.param].to = tween_cfg.to
                    asset.tweens[tween_id] = scene.tweens.add(tween_cfg)

                    if (cfg.start_tween !== tween_id) { asset.tweens[tween_id].stop() }
                }
            }

            asset.name = cfg.name
            asset.asset_id = cfg.name // ???
            asset.type = cfg.type
            return asset
        }
    },

    add_asset: function (scene, scene_id, asset_id) {
        const scenecfg = scene.cache.json.get('scenecfg')
        const scene_info = scenecfg.scenes[scene_id]
        for (const i in scene_info.assets) {
            const cfg = scene_info.assets[i]
            if (cfg.name !== asset_id) continue

            const asset = this._add_asset(cfg, scene)
            if (asset) {
                this.assets[cfg.name] = asset
                return asset
            }
        }
    },

    init_scene: function (scene, scene_id) {
        this.assets = {}

        const scenecfg = scene.cache.json.get('scenecfg')
        const scene_info = scenecfg.scenes[scene_id]
        for (const i in scene_info.assets) {
            const cfg = scene_info.assets[i]
            const asset = this._add_asset(cfg, scene, true)
            if (asset) {
                this.assets[cfg.name] = asset
            }
        }

        if (scene_info.config.background) {
            scene.cameras.main.setBackgroundColor(scene_info.config.background)
        }
    }
}

export default SceneJam
