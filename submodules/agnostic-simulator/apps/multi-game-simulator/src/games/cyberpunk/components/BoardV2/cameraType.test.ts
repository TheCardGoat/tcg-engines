import { expect, it } from "vite-plus/test";
import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import { isPerspectiveCamera } from "./cameraType";

it("recognizes a perspective camera when its constructor comes from another module", () => {
  const camera = new PerspectiveCamera();
  // Preserve the camera's public API while reproducing separate module identity.
  const foreignCamera = new Proxy(camera, { getPrototypeOf: () => Camera.prototype });
  expect(foreignCamera instanceof PerspectiveCamera).toBe(false);
  expect(isPerspectiveCamera(foreignCamera)).toBe(true);
  expect(isPerspectiveCamera(camera)).toBe(true);
  expect(isPerspectiveCamera(new OrthographicCamera())).toBe(false);
  expect(isPerspectiveCamera(new Camera())).toBe(false);
});
