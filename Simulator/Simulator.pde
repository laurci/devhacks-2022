StringDict inventory;

void setup() {
  size(1920, 1080);
  inventory = new StringDict();
  inventory.set("coffee","black");
  inventory.set("flour","white");
  inventory.set("tea","green");
  println(inventory);
  fill(0);
  textAlign(CENTER);
}

void draw() {
  background(204);
  translate(width/2, height/2);
  float a = atan2(mouseY-height/2, mouseX-width/2);
  rotate(a);
  rect(-30, -5, 60, 10);
}