class Scene {
    _background;
    _objects;
    _has_image = false;

    constructor(img, objects) {
        if (img.charAt(0) == "#") {
            this._background = img;
            this._has_image = false;
        }
        else {
            this._background = loadImage(img);
            this._has_image = true;
        }
        this._objects = objects;
    }


    update() {
        for (const object of this._objects) {
            if (object) object.update();
        }
    }

    click() {
        for (const object of this._objects) {
            if (object) object.click();
        }
    }

    render() {
        if (this._has_image) gc.image(this._background, 0, 0, gc.width, gc.height);
        else gc.background(this._background);

        for (const object of this._objects) {
            if (object) object.render();
        }
    }


}

class TitleScene extends Scene {
    constructor() {
        super("#FFE4EC", [
            new RenderedObject("../res/images/pingu-head.png", gc.width / 2, 290 / 2, 230, 290,
                {
                    center: true
                }),
            new Text("Pingu Machine", gc.width / 2, 9 * gc.height / 16, 0, 0, {
                strokeWeight: 8,
                stroke: "#F0BFBF",
                fill: 255,
                centerAlign: true,
                centerBaseline: true
            }),
            new Button("Play", gc.width / 2, 16 * gc.height / 20, gc.width / 2, gc.height / 8, {
                center: true,
                strokeWeight: 5,
                stroke: "#F0BFBF",
                fill: 255,
                textFill: "#F0BFBF"
            }, () => {
                cur_scene = new TransitionScene(scene_manager.get_scene("house"));
            })
        ]);
    }
}

class TransitionScene {
    #alpha;
    #next_scene;
    #prev_scene;
    #fwd;

    constructor(scene) {
        this.#alpha = 1;
        this.#fwd = true;
        this.#next_scene = scene;
        this.#prev_scene = cur_scene;
        this._background = 0;
    }
    update() {
        if (this.#fwd) {
            this.#alpha += 20;

            if (this.#alpha >= 255) {
                this.#fwd = false;
            }
        }
        else {
            this.#alpha -= 20;

            if (this.#alpha <= 0) {
                cur_scene = this.#next_scene;
            }
        }
    }
    render() {
        if (this.#fwd) this.#prev_scene.render();
        else this.#next_scene.render();
        gc.background(this._background, this.#alpha);
    }
    click() { }
}

class HouseScene extends Scene {
    constructor() {
        super("../res/images/house.png", [
            new ClickableObject("../res/images/door.png", gc.width / 2, gc.height / 2 + 172 / 2 + 21, 85, 172, {
                center: true
            }, () => {
                cur_scene = new TransitionScene(scene_manager.get_scene("intro"));
            })
        ]);
    }
}

class IntroScene extends Scene {
    constructor() {
        super("../res/images/intro-background.png", [
            new TextBox(["Hello! Can you help me clean my house?", "Thank you! Here's the map of my house!"], ["Yes", false], 50, gc.height - 20 - 175, gc.width - 100, 175, {
                strokeWeight: 8,
                stroke: "#f9bfbf",
                fill: "#f4f5f5",
                font: 40
            }, () => { cur_scene = new TransitionScene(scene_manager.get_scene("map")) })
        ])
    }
}

class MapScene extends Scene {
    #location
    #pingu
    constructor() {
        super("../res/images/map.png", [
            new ClickableObject("", gc.width / 2 - 300, gc.height / 2, 300, 600, { display: false, center: true }, () => { cur_scene = scene_manager.get_scene("bathroom"); this.#location = 0 }),
            new ClickableObject("", gc.width / 2 + 300, gc.height / 2, 300, 600, { display: false, center: true }, () => { cur_scene = scene_manager.get_scene("bedroom"); this.#location = 2 })
        ])
        this.#location = 1;
        this.#pingu = loadImage("../res/images/pingu-head.png");
    }
    render() {
        super.render();
        gc.imageMode(CENTER);
        gc.image(this.#pingu, gc.width / 2 + (this.#location - 1) * 300, gc.height / 2, 100, 130)
        gc.imageMode(CORNER);
    }
}

class BathroomScene extends Scene {
    constructor() {
        super("#A8A5E6", [
            new Progress(gc.width * 2 / 3, 10, gc.width / 3, 30),
            new ClickableObject("../res/images/dirty-toilet.png", gc.width / 2 - 350, gc.height - 454 * 1 / 3, 217 * 2 / 3, 454 * 2 / 3, { center: true }, () => { cur_scene = scene_manager.get_scene("toilet") }),
            new ClickableObject("../res/images/dirty-mirror.png", gc.width / 2 - 75, gc.height - 785 * 1 / 3, 285 * 2 / 3, 785 * 2 / 3, { center: true }, () => { cur_scene = scene_manager.get_scene("mirror") }),
            new ClickableObject("../res/images/dirty-bath.png", gc.width / 2 + 280, gc.height - 759 * 1 / 3, 546 * 2 / 3, 759 * 2 / 3, { center: true }, () => { cur_scene = scene_manager.get_scene("bath") }),
            new ClickableObject("../res/images/arrow.png", 10, 10, 60, 60, {}, () => { cur_scene = scene_manager.get_scene("map") })
        ]);
    }
}

class CleanScene extends Scene {
    #color
    constructor(img, objects, color) {
        super(img, objects)
        this.#color = color;
    }
    render() {
        if (this._has_image) gc.image(this._background, 0, 0, gc.width, gc.height);
        else gc.background(this._background);

        gc.fill(this.#color)
        gc.rect(gc.width / 2 + 30, 30, gc.width / 2 - 60, gc.height - 60, 30)

        for (const object of this._objects) {
            if (object) object.render();
        }
    }
}
class CleanToiletScene extends CleanScene {
    #clicked
    constructor() {
        super("#A8A5E6", [
            new RenderedObject("../res/images/toilet.png", 60, 30 + 340 / 3, gc.width / 2 - 150, gc.height - 60 - 340 / 3, {}),
            new ClickableObject("../res/images/flower-a.png", gc.width / 2 + 150, gc.height / 2 - 20, 180 * 2 / 3, 340 * 2 / 3, { center: true }, () => {
                this._objects[1] = new RenderedObject("../res/images/flower-a.png", 80, 30, 180 * 1 / 3, 340 * 1 / 3, {});
                this.#clicked++;
            }),
            new ClickableObject("../res/images/flower-b.png", gc.width - 180 * 2 / 3 - 20, gc.height / 2 - 150, 180 * 2 / 3, 340 * 2 / 3, { center: true }, () => {
                if (this.#clicked === 1) {
                    this._objects[2] = new RenderedObject("../res/images/flower-b.png", (120 + gc.width / 2 - 150) / 2 - 180 * 1 / 3 + 20, 30, 180 * 1 / 3, 340 * 1 / 3, {})
                    this.#clicked++;
                }
            }),
            new ClickableObject("../res/images/flower-c.png", gc.width - 180 * 2 / 3 - 20, gc.height / 2 + 150, 180 * 2 / 3, 340 * 2 / 3, { center: true }, () => {
                if (this.#clicked === 2) {
                    this._objects[3] = new RenderedObject("../res/images/flower-c.png", (60 + gc.width / 2 - 150) - 180 * 1 / 3 - 20, 30, 180 * 1 / 3, 340 * 1 / 3, {})
                    cur_scene = new TransitionScene(scene_manager.get_scene("bathroom"));
                    scene_manager.get_scene("bathroom")._objects[0].increase(33.3333333);
                    scene_manager.get_scene("bathroom")._objects[1] = new RenderedObject("../res/images/clean-toilet.png", gc.width / 2 - 350, gc.height - 454 * 1 / 3, 217 * 2 / 3, 454 * 2 / 3, { center: true })

                }
            })
        ], "#e1d8cc")
        this.#clicked = 0;
    }
}

class CleanMirrorScene extends CleanScene {
    #clicked
    constructor() {
        super("#A8A5E6", [
            new RenderedObject("../res/images/dirty-mirror.png", 110, 30, gc.width / 2 - 220, gc.height - 60, {}),
            new ClickableObject("../res/images/water.png", gc.width / 2 + 150, gc.height / 2 - 20, 215 * 2 / 3, 271 * 2 / 3, { center: true }, () => {
                this._objects[1] = new RenderedObject("../res/images/water.png", 110 + (gc.width / 2 - 220) / 2, 60 + 271 * 1 / 3, 215 * 2 / 3, 271 * 2 / 3, { center: true });
                this.#clicked++;
            }),
            new ClickableObject("../res/images/towel.png", gc.width - 180 * 2 / 3 - 20, gc.height / 2 - 150, 215 * 2 / 3, 271 * 2 / 3, { center: true }, () => {
                if (this.#clicked === 1) {
                    this._objects[2] = new RenderedObject("../res/images/towel.png", 110 + (gc.width / 2 - 220) / 2, 60 + 271 * 1 / 3, 215 * 2 / 3, 271 * 2 / 3, { center: true });
                    cur_scene = new TransitionScene(scene_manager.get_scene("bathroom"));
                    scene_manager.get_scene("bathroom")._objects[2] = new RenderedObject("../res/images/clean-mirror.png", gc.width / 2 - 75, gc.height - 785 * 1 / 3, 285 * 2 / 3, 785 * 2 / 3, { center: true });
                    scene_manager.get_scene("bathroom")._objects[0].increase(33.333333333);
                }
            })
        ], "#e1d8cc")
        this.#clicked = 0;
    }
}

class CleanBathScene extends CleanScene {
    #clicked
    constructor() {
        super("#A8A5E6", [
            new RenderedObject("../res/images/dirty-bath.png", 60, 30, gc.width / 2 - 120, gc.height - 60, {}),
            new Shelf("#A8A5E6", gc.width / 2 + 40, 50, gc.width / 2 - 80, 400 * 2 / 3, {}),
            new ClickableObject("../res/images/bottle-1.png", gc.width / 2 + 30 + 30, gc.height - 344 * 2 / 3 - 50, 147 * 2 / 3, 344 * 2 / 3, {}, () => {
                this._objects[2] = new RenderedObject("../res/images/bottle-1.png", gc.width / 2 + 30 + 30, 55, 147 * 2 / 3, 344 * 2 / 3, {})
                this.#clicked++;
                if (this.#clicked === 3) {
                    scene_manager.get_scene("bathroom")._objects[3] = new RenderedObject("../res/images/clean-bath.png", gc.width / 2 + 280, gc.height - 759 * 1 / 3, 546 * 2 / 3, 759 * 2 / 3, { center: true })
                    scene_manager.get_scene("bathroom")._objects[0].increase(33.333333333);
                    cur_scene = new TransitionScene(scene_manager.get_scene("bathroom"));
                }
            }),
            new ClickableObject("../res/images/bottle-2.png", gc.width / 2 + 30 + 60 + 147 * 2 / 3, gc.height - 344 * 2 / 3 - 50, 147 * 2 / 3, 344 * 2 / 3, {}, () => {
                this._objects[3] = new RenderedObject("../res/images/bottle-2.png", gc.width / 2 + 30 + 60 + 147 * 2 / 3, 55, 147 * 2 / 3, 344 * 2 / 3, {})
                this.#clicked++;
                if (this.#clicked === 3) {
                    scene_manager.get_scene("bathroom")._objects[3] = new RenderedObject("../res/images/clean-bath.png", gc.width / 2 + 280, gc.height - 759 * 1 / 3, 546 * 2 / 3, 759 * 2 / 3, { center: true })
                    scene_manager.get_scene("bathroom")._objects[0].increase(33.333333333);
                    cur_scene = new TransitionScene(scene_manager.get_scene("bathroom"));
                }
            }),
            new ClickableObject("../res/images/bottle-3.png", gc.width / 2 + 30 + 90 + 147 * 4 / 3, gc.height - 344 * 2 / 3 - 50, 147 * 2 / 3, 344 * 2 / 3, {}, () => {
                this._objects[4] = new RenderedObject("../res/images/bottle-3.png", gc.width / 2 + 30 + 90 + 147 * 4 / 3, 55, 147 * 2 / 3, 344 * 2 / 3, {})
                this.#clicked++;
                if (this.#clicked === 3) {
                    cur_scene = new TransitionScene(scene_manager.get_scene("bathroom"));
                    scene_manager.get_scene("bathroom")._objects[3] = new RenderedObject("../res/images/clean-bath.png", gc.width / 2 + 280, gc.height - 759 * 1 / 3, 546 * 2 / 3, 759 * 2 / 3, { center: true })
                    scene_manager.get_scene("bathroom")._objects[0].increase(33.333333333);
                }
            })

        ], "#e1d8cc")
        this.#clicked = 0;
    }
}

class BedroomScene extends Scene {
    #bed;
    constructor() {
        super("../res/images/bedroom-background.png", [
            new Progress(gc.width * 2 / 3, 10, gc.width / 3, 30),
            new ClickableObject("../res/images/dirty-closet.png", 10, gc.height - 703 * 2 / 3, 384 * 2 / 3, 703 * 2 / 3, {}, () => {
                if (this.#bed) {
                    cur_scene = scene_manager.get_scene("closet");
                }
            }),
            new ClickableObject("../res/images/dirty-bed.png", 10 + 384 * 2 / 3 + 20, gc.height - 341 * 2 / 3, 667 * 2 / 3, 341 * 2 / 3, {}, () => {
                this.#bed = true;
                this._objects[2] = new RenderedObject("../res/images/clean-bed.png", 10 + 384 * 2 / 3 + 20, gc.height - 341 * 2 / 3, 667 * 2 / 3, 341 * 2 / 3, {})
                this._objects[0].increase(33.333333)
            }),
            new ClickableObject("../res/images/dirty-dresser.png", gc.width - 30 - 256 * 2 / 3, gc.height - 555 * 2 / 3, 256 * 2 / 3, 555 * 2 / 3, {}, () => {
                cur_scene = scene_manager.get_scene("dresser");
            }),
            new ClickableObject("../res/images/arrow.png", 10, 10, 60, 60, {}, () => { cur_scene = scene_manager.get_scene("map") })
        ]);
        this.#bed = false;
    }
}

class CleanClosetScene extends CleanScene {
    #clicked
    constructor() {
        super("#FFE1E5", [
            new RenderedObject("../res/images/dirty-closet.png", 60, 30, gc.width / 2 - 120, gc.height - 60, {}),
            new ClickableObject("../res/images/shirt-1.png", gc.width * 3 / 4, gc.height - (194 + 60) * 2 / 3, 240 * 2 / 3, 194 * 2 / 3, { center: true }, () => {
                this.#clicked++;

                this._objects[1] = new RenderedObject("../res/images/shirt-1.png", gc.width / 2 - 240 * 2 / 3 - 5, gc.height / 2 + 130, 240 * 2 / 3, 194 * 2 / 3, { center: true });
                if (this.#clicked === 3) {
                    scene_manager.get_scene("bedroom")._objects[1] = new RenderedObject("../res/images/clean-closet.png", 10, gc.height - 703 * 2 / 3, 384 * 2 / 3, 703 * 2 / 3, {});
                    scene_manager.get_scene("bedroom")._objects[0].increase(33.33333)
                    cur_scene = new TransitionScene(scene_manager.get_scene("bedroom"));
                }
            }),
            new ClickableObject("../res/images/shirt-2.png", gc.width * 3 / 4, gc.height - (194 + 60) * 4 / 3, 240 * 2 / 3, 194 * 2 / 3, { center: true }, () => {
                this.#clicked++;

                this._objects[2] = new RenderedObject("../res/images/shirt-2.png", gc.width / 2 - 240 * 2 / 3 - 7, 194 * 2 / 3 + 51, 240 * 2 / 3, 194 * 2 / 3, { center: true });
                if (this.#clicked === 3) {
                    scene_manager.get_scene("bedroom")._objects[1] = new RenderedObject("../res/images/clean-closet.png", 10, gc.height - 703 * 2 / 3, 384 * 2 / 3, 703 * 2 / 3, {});
                    scene_manager.get_scene("bedroom")._objects[0].increase(33.33333)
                    cur_scene = new TransitionScene(scene_manager.get_scene("bedroom"));
                }
            }),
            new ClickableObject("../res/images/shirt-3.png", gc.width * 3 / 4, gc.height - (194 + 60) * 2, 240 * 2 / 3, 194 * 2 / 3, { center: true }, () => {
                this.#clicked++;

                this._objects[3] = new RenderedObject("../res/images/shirt-3.png", gc.width / 2 - 240 * 4 / 3, gc.height / 2 + 130, 240 * 2 / 3, 194 * 2 / 3, { center: true });
                if (this.#clicked === 3) {
                    scene_manager.get_scene("bedroom")._objects[1] = new RenderedObject("../res/images/clean-closet.png", 10, gc.height - 703 * 2 / 3, 384 * 2 / 3, 703 * 2 / 3, {});
                    scene_manager.get_scene("bedroom")._objects[0].increase(33.33333)
                    cur_scene = new TransitionScene(scene_manager.get_scene("bedroom"));
                }
            }),
        ], "#e1d8cc")
        this.#clicked = 0;
    }
}

class CleanDresserScene extends CleanScene {
    #clicked
    constructor() {
        super("#FFE1E5", [
            new RenderedObject("../res/images/dirty-dresser.png", 60, 30, gc.width / 2 - 120, gc.height - 60, {}),
            new ClickableObject("../res/images/water.png", gc.width * 3 / 4, gc.height - (273 + 60) * 2 / 3, 189 * 2 / 3, 273 * 2 / 3, { center: true }, () => {
                this.#clicked++;

                this._objects[1] = new RenderedObject("../res/images/water.png", gc.width / 4 - 60, 273 * 1 / 2 + 30, 189 * 2 / 3, 273 * 2 / 3, { center: true });
            }),
            new ClickableObject("../res/images/towel.png", gc.width * 3 / 4, gc.height - (273 + 60) * 4 / 3, 240 * 2 / 3, 194 * 2 / 3, { center: true }, () => {
                if (this.#clicked === 1) {
                    this.#clicked++;

                    this._objects[2] = new RenderedObject("../res/images/towel.png", gc.width / 4 - 60, 194 * 1 / 2 + 30, 240 * 2 / 3, 194 * 2 / 3, { center: true });
                    scene_manager.get_scene("bedroom")._objects[3] = new RenderedObject("../res/images/clean-dresser.png", gc.width - 30 - 256 * 2 / 3, gc.height - 555 * 2 / 3, 256 * 2 / 3, 555 * 2 / 3, {});
                    scene_manager.get_scene("bedroom")._objects[0].increase(33.33333)
                    cur_scene = new TransitionScene(scene_manager.get_scene("bedroom"));
                }
            })
        ], "#e1d8cc")
        this.#clicked = 0;
    }
}

class EndScene extends Scene {
    constructor() {
        super("#FFE4EC", [
            new RenderedObject("../res/images/bye.png", gc.width / 2, gc.height / 2 - 200, 350 * 2 / 3, 362 * 2 / 3, { center: true }),
            new Text("See you soon!", gc.width / 2, gc.height / 2, gc.width, gc.height, {
                strokeWeight: 8,
                stroke: "#F0BFBF",
                fill: 255,
                centerAlign: true,
                centerBaseline: true
            }),
            new Button("Exit", gc.width / 2, 16 * gc.height / 20, gc.width / 2, gc.height / 8, {
                center: true,
                strokeWeight: 5,
                stroke: "#F0BFBF",
                fill: 255,
                textFill: "#F0BFBF"
            }, () => {
                scene_manager.init();
                cur_scene = new TransitionScene(scene_manager.get_scene("title"));
            })
        ])
    }
}