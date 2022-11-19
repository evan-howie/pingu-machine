class ScreenObject {
    _x;
    _y;
    _w;
    _h;

    constructor(x, y, w, h) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }
}

class RenderedObject extends ScreenObject {
    #image;
    #glow;

    constructor(img, glow, x, y, w, h) {
        super(x, y, w, h);
        this.#image = loadImage(img);
        this.#glow = glow;
    }

    render(gc) {
        if (this.#glow) {
            this.render_glow(gc);
        }
        gc.image(this.#image, this._x, this._y, this._w, this._h);
    }

    render_glow(gc) {
        let offset = 10;
        let background = createGraphics(this._w + offset, this._h + offset);
        background.image(this.#image, 0, 0, background.width, background.height)
        background.loadPixels();
        for (let i = 0; i < background.width; i++) {
            for (let j = 0; j < background.height; j++) {
                let pixel = (i + j * background.width) * 4;
                let glow_color;

                if (background.pixels[pixel] == 0 && background.pixels[pixel + 1 == 0] && background.pixels[pixel + 2 == 0])
                    glow_color = color(255, 255, 255, 0);

                else {
                    glow_color = color(255, 255, 0,
                        min(map(i, 0, 10, 0, 255, true),
                            map(i, background.width - 10, background.width, 255, 0, true),
                            map(j, 0, 10, 0, 255, true),
                            map(j, background.height - 10, background.height, 255, 0, true)));
                }
                background.set(i, j, glow_color);
            }
        }
        background.updatePixels();
        gc.image(background, this._x - offset / 2, this._y - offset / 2);
    }
}

class ClickableObject extends RenderedObject {
    #is_hovered
    update() {
        this.#is_hovered = mouseX >= this._x && mouseX < this._x + this._w &&
            mouseY >= this._y && mouseY < this._y + this._h;
        if (this.#is_hovered) {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/clicker.png")');
        } else {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/cursor.png")');
        }

    }
}
