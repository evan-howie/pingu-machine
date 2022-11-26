class SceneManager {
    #scenes;
    constructor() {
        this.#scenes = {
            "title": new TitleScene(),
            "house": new HouseScene(),
            "intro": new IntroScene(),
            "map": new MapScene(),
            "bathroom": new BathroomScene(),
            "toilet": new CleanToiletScene(),
            "mirror": new CleanMirrorScene(),
            "bath": new CleanBathScene(),
            "bedroom": new BedroomScene(),
            "closet": new CleanClosetScene(),
            "dresser": new CleanDresserScene(),
            "end": new EndScene()
        }
    }

    get_scene(name) {
        if (this.#scenes["bedroom"]._objects[0].get_progress() === 100 && this.#scenes["bathroom"]._objects[0].get_progress() === 100)
            return this.#scenes["end"];
        return this.#scenes[name];
    }
    init() {
        this.#scenes = {
            "title": new TitleScene(),
            "house": new HouseScene(),
            "intro": new IntroScene(),
            "map": new MapScene(),
            "bathroom": new BathroomScene(),
            "toilet": new CleanToiletScene(),
            "mirror": new CleanMirrorScene(),
            "bath": new CleanBathScene(),
            "bedroom": new BedroomScene(),
            "closet": new CleanClosetScene(),
            "dresser": new CleanDresserScene(),
            "end": new EndScene()
        }
    }
}