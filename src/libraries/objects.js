class ScreenObject {
    _x;
    _y;
    _w;
    _h;
    _styles;

    constructor(x, y, w, h, styles) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._styles = styles;
    }

    click() { }
    update() { }
}

class RenderedObject extends ScreenObject {
    #image;

    constructor(img, x, y, w, h, styles) {
        super(x, y, w, h, styles);
        if (!("display" in styles)) this.#image = loadImage(img);
        if (styles.center) {
            this._x -= this._w / 2;
            this._y -= this._h / 2;
        }
    }

    render() {
        if (!("display" in this._styles)) {
            if (this._w === 0 || this._h === 0) gc.image(this.#image, this._x, this._y);
            else gc.image(this.#image, this._x, this._y, this._w, this._h);
        }
    }
}

class ClickableObject extends RenderedObject {
    #is_hovered
    #on_click
    constructor(img, x, y, w, h, styles, on_click) {
        super(img, x, y, w, h, styles);
        this.#on_click = on_click;
    }
    update() {
        this.#is_hovered = mx >= this._x && mx < this._x + this._w && my >= this._y && my < this._y + this._h

        if (this.#is_hovered) {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/clicker.png")');
        }
    }
    click() {
        if (this.#is_hovered) {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/cursor.png")');
            this.#on_click();
        }
    }
}

class Text extends ScreenObject {
    #text
    #align
    #baseline

    constructor(text, x, y, w, h, styles) {
        super(x, y, w, h, styles);
        this.#text = text;
        this.#align = (styles.centerAlign) ? CENTER : CORNER;
        this.#baseline = (styles.centerAlign) ? CENTER : CORNER;
    }

    render() {
        gc.strokeWeight(this._styles.strokeWeight);
        gc.stroke(this._styles.stroke)
        gc.textAlign(this.#align, this.#baseline);
        gc.fill(this._styles.fill);
        gc.textSize(gc.height / 6);
        gc.text(this.#text, this._x, this._y);
    }
}

class Button extends ScreenObject {
    #is_hovered;
    #text;
    #on_click

    constructor(text, x, y, w, h, styles, on_click) {
        super(x, y, w, h, styles);
        this.#text = text;
        this.#on_click = on_click;
        if (styles.center) {
            this._x = x - w / 2;
            this._y = y - h / 2;
        }
    }

    update() {
        this.#is_hovered = mx >= this._x + this._h / 2 && mx < this._x - this._h / 2 + this._w &&
            my >= this._y && my < this._y + this._h;
        this.#is_hovered ||= dist(mx, my, this._x + this._h / 2, this._y + this._h / 2) < this._h / 2
        this.#is_hovered ||= dist(mx, my, this._x + this._w - this._h / 2, this._y + this._h / 2) < this._h / 2
        if (this.#is_hovered) {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/clicker.png")');
        }
    }

    click() {
        if (this.#is_hovered) {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/cursor.png")');
            this.#on_click();
        }
    }

    render() {
        if (Object.keys(this._styles).length) {
            gc.strokeWeight(this._styles.strokeWeight);
            gc.stroke(this._styles.stroke)
            gc.fill(this._styles.fill);
            gc.rect(this._x, this._y, this._w, this._h, this._h / 2, this._h / 2, this._h / 2, this._h / 2);
            gc.textAlign(CENTER, CENTER);
            gc.fill(255);

            gc.noStroke();
            gc.fill(this._styles.textFill);
            gc.textSize(this._h * 2 / 3);
            gc.text(this.#text, this._x + this._w / 2, this._y + this._h / 2);
        }
    }
}

class TextBox extends ScreenObject {
    #is_hovered
    #cur_text;
    #text;
    #options;
    #on_click
    constructor(text, options, x, y, w, h, styles, on_click) {
        super(x, y, w, h, styles);
        this.#text = text;
        this.#options = [];
        this.#on_click = on_click;
        for (const option of options) {
            if (option) this.#options.push(new Button(option, this._x + this._w / 2, this._y + this._h - 10 - 60, this._styles.font * 3, 60,
                { ...this._styles, center: true, textFill: 0 }, this.on_click));
            else this.#options.push(false);
        }
        this.#cur_text = 0;
    }

    update() {
        this.#is_hovered = mx >= this._x && mx < this._x + this._w && my >= this._y && my < this._y + this._h;

        if (this.#is_hovered) {
            document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/clicker.png")');
        }
    }

    render() {
        gc.strokeWeight(this._styles.strokeWeight);
        gc.stroke(this._styles.stroke);
        gc.fill(this._styles.fill);
        gc.textSize(this._styles.font);
        gc.textAlign(CENTER, TOP);

        gc.rect(this._x, this._y - this._styles.font - 10, this._styles.font * 5, this._styles.font + 10, 30);
        gc.rect(this._x, this._y, this._w, this._h, 30);

        gc.noStroke();
        gc.fill(0);
        gc.text("Pingu", this._x, this._y - this._styles.font - 5, this._styles.font * 5)
        if (this.#options[this.#cur_text]) gc.text(this.#text[this.#cur_text], this._x, this._y + 20, this._w);
        else gc.text(this.#text[this.#cur_text], this._x, this._y + this._h / 2 - this._styles.font / 2, this._w);
        if (this.#options[this.#cur_text]) this.#options[this.#cur_text].render();
    }
    click() {
        if (this.#cur_text < this.#text.length - 1) this.#cur_text++;
        else {
            this.#on_click();
        }
    }
}

class Progress extends ScreenObject {
    #progress
    constructor(x, y, w, h, styles) {
        super(x, y, w, h, styles)
        this.#progress = 0;
    }

    update() { }
    click() { }
    render() {
        gc.fill(0);
        gc.noStroke();
        gc.textSize(20);
        gc.textAlign(LEFT, TOP);
        gc.text("Task Completion", this._x, this._y);
        gc.fill(255);
        gc.rect(this._x - 10, this._y + 20, this._w, this._h, 5);
        gc.fill(0, 255, 0);
        gc.rect(this._x - 10, this._y + 20, map(this.#progress, 0, 100, 0, this._w), this._h, 5);
        gc.textAlign(CENTER, TOP);
        gc.fill(0);
        gc.text(round(this.#progress) + "%", this._x, this._y + 25, this._w);
    }
    increase(inc) { this.#progress = inc + this.#progress }
    get_progress() { return round(this.#progress) }
}

class Shelf extends ScreenObject {
    #color
    constructor(color, x, y, w, h) {
        super(x, y, w, h);
        this.#color = color;
    }
    render() {
        gc.fill(this.#color)
        gc.noStroke();
        gc.rect(this._x, this._y, this._w, this._h, 30);
        gc.stroke(255);
        gc.strokeWeight(5);
        gc.line(this._x + 3, this._y + this._h - 30, this._x + this._w - 6, this._y + this._h - 30)
    }
}