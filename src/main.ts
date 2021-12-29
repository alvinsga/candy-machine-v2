import "./app.css";
import App from "./App.svelte";
// To resolve buffer not defined issues
import { Buffer } from "buffer";
window.Buffer = Buffer;

const app = new App({
  target: document.getElementById("app"),
});

export default app;
