class SceneManager {
    #scenes;
    constructor() {
        this.#scenes = {
            "title": new TitleScene(this)
        }
    }

    get_scene(name) {
        return this.#scenes[name];
    }
}