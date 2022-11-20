import "../lib/web-globals";
import "./canvas";
import { setupSerial } from "./serial";

window.onclick = () => {
    setupSerial();
}
