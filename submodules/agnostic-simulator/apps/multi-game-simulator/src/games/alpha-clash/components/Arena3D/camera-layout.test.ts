import { expect, test } from "vite-plus/test";
import { PerspectiveCamera, Vector3 } from "three";
import { boardFrameCover, boardFrameSize, fitArenaCamera } from "./camera-layout";
import { arenaRows } from "./layout";

test.each([
  [893, 810, false],
  [1440, 900, false],
  [1920, 1080, false],
  [640, 480, true],
] as const)("stable arena and full background at %s x %s", (width, height, compact) => {
  const camera = new PerspectiveCamera(40, width / height, 1, 5000);
  const size = { width, height };
  fitArenaCamera(camera, size, compact);
  const matrix = camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse);
  const cover = boardFrameCover(camera, compact);
  const frame = boardFrameSize(compact);

  // Decoration covers all four screen corners, without changing the camera.
  for (const x of [-1, 1])
    for (const y of [-1, 1]) {
      const ray = new Vector3(x, y, 0).unproject(camera).sub(camera.position);
      const point = camera.position.clone().addScaledVector(ray, (-8 - camera.position.z) / ray.z);
      expect(Math.abs(point.x)).toBeLessThanOrEqual((frame.width * cover) / 2 + 1e-6);
      expect(Math.abs(point.y - frame.y)).toBeLessThanOrEqual((frame.height * cover) / 2 + 1e-6);
    }
  for (const own of [true, false]) {
    const row = arenaRows(compact, own);
    const point = new Vector3(
      0,
      (own ? -1 : 1) * (row.railCenter + row.railHeight / 2),
      24,
    ).project(camera);
    expect(Math.abs(point.y)).toBeLessThan(1);
  }

  // Repeated layout passes cannot accumulate camera translation or scale drift.
  for (let i = 0; i < 10; i++) fitArenaCamera(camera, size, compact);
  expect(camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse).elements).toEqual(
    matrix.elements,
  );
  expect(boardFrameCover(camera, compact)).toBe(cover);

  fitArenaCamera(camera, { width: width + 100, height }, compact);
  expect(camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse).elements).not.toEqual(
    matrix.elements,
  );
});
