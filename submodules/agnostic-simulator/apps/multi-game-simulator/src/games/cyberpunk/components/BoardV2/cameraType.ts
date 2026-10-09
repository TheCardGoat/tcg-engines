import type { Camera, PerspectiveCamera } from "three";

/** R3F and the app can load separate Three modules. Use Three's type marker,
 * so constructor identity cannot prevent the DOM layer from following its camera. */
export function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
  return "isPerspectiveCamera" in camera && camera.isPerspectiveCamera === true;
}
