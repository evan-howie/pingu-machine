class Scene {
    #background;
    #objects;
    #manager;

    constructor(img, objects, manager) {
        this.#background = loadImage(img);
        this.#objects = objects;
        this.#manager = manager;
    }

    update(mx, my) {
        for (const object of this.#objects) {
            object.update();
        }
    }

    render(gc) {
        gc.image(this.#background, 0, 0, width, height);

        for (const object of this.#objects) {
            object.render(gc);
        }
    }
}

class TitleScene extends Scene {
    constructor(manager) {
        super("../res/images/title-background.png", [
            new ClickableObject("../res/images/box.png", true, 100, height - 100, 100, 100)
        ], manager);
    }
}