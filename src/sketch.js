let cur_scene;
let gc;

function setup() {
	createCanvas(windowWidth, windowHeight);

	scene_manager = new SceneManager();

	cur_scene = scene_manager.get_scene("title");

	gc = createGraphics(width, height);
}

function draw() {
	cur_scene.update();
	cur_scene.render(gc);
	gc.circle(mouseX, mouseY, 50);
	image(gc, 0, 0, width, height);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	let temp = createGraphics(width, height);
	temp.image(gc, 0, 0, width, height);
	gc = temp;
}