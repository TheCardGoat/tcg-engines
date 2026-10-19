import { expect, test } from "vite-plus/test";
import { PerspectiveCamera, Vector3 } from "three";
import { resolutionFocusPose } from "@tcg/simulator-presentation/targeted-resolution";
import { paymentPlacement } from "./payment-placement";
import type { PlacedCard } from "./layout";
const card: PlacedCard = {
  card: {
    instanceId: "source",
    controller: "player-one",
    zone: "hand",
    faceDown: false,
    ready: true,
    definitionId: "visible",
    name: "Source",
    phaseDamage: 0,
    clashDamage: 0,
  },
  x: 0,
  y: 0,
  z: 0,
  height: 200,
  angle: 0,
  hand: true,
};
test.each([
  [929, 802],
  [844, 390],
])("scene payment pose matches the shared panel at %s by %s", (width, height) => {
  const camera = new PerspectiveCamera(40, width / height, 100, 4000);
  camera.position.set(0, -360, 1900);
  camera.lookAt(0, -60, 0);
  camera.updateMatrixWorld();
  const target = paymentPlacement(card, camera, width, height);
  const center = new Vector3(target.x, target.y, target.z).project(camera);
  const rect = resolutionFocusPose(width, height);
  expect(((center.x + 1) * width) / 2).toBeCloseTo(rect.left + rect.width / 2);
  expect(((1 - center.y) * height) / 2).toBeCloseTo(rect.top + rect.height / 2);
  expect(target.card).toBe(card.card);
  expect(target.hand).toBe(false);
});
