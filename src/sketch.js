let cur_scene;
let gc;
let mx, my;

function setup() {
	createCanvas(windowWidth, windowHeight);
	gc = createGraphics(1440 * 2 / 3, 1024 * 2 / 3);

	scene_manager = new SceneManager();

	cur_scene = scene_manager.get_scene("end");
	gc.textFont("Kulim Park");
	gc.textStyle(BOLD);
}

function draw() {
	document.documentElement.style.setProperty('--cursor-path', 'url("../res/images/cursor.png")');
	mx = mouseX - (width - gc.width) / 2
	my = mouseY - (height - gc.height) / 2

	// background("#FFE4EC");
	background(0);
	cur_scene.update();
	cur_scene.render();

	imageMode(CENTER)
	image(gc, width / 2, height / 2);
	imageMode(CORNER)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	cur_scene.click();
}