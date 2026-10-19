import { expect, test } from "vite-plus/test";
import { Euler, PerspectiveCamera, Vector3 } from "three";
import { handHitBounds, handPlacement, handScreenBounds, handScreenSlot } from "./hand-layout";
import { arenaLayout, CARD_RATIO, type PlacedCard } from "./layout";
import type { LiveBoardState } from "../board-types";

const card: PlacedCard = {
  card: {
    instanceId: "hand-card",
    controller: "player-one",
    zone: "hand",
    ready: true,
    faceDown: false,
    definitionId: null,
    name: "Card",
    clashDamage: 0,
    phaseDamage: 0,
  },
  x: 0,
  y: -470,
  z: 85,
  height: 205,
  angle: 0,
  hand: true,
};

for (const view of [
  { width: 1280, height: 720, compact: false },
  { width: 1126, height: 800, compact: false },
  { width: 844, height: 390, compact: true },
]) {
  test(`hands keep their screen size and input alignment when the board camera changes at ${view.width}x${view.height}`, () => {
    for (const [distance, tilt, fov] of [
      [1300, -400, 35],
      [2700, -850, 55],
    ]) {
      const camera = new PerspectiveCamera(fov, view.width / view.height, 100, 4000);
      camera.position.set(0, tilt, distance);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      for (const rival of [false, true]) {
        for (const index of [0, 3, 6]) {
          const placed = handPlacement(card, index, 7, rival, { ...view, camera });
          const expected = handScreenBounds(handScreenSlot(index, 7, rival, view));
          const points = [-1, 1].flatMap((x) =>
            [-1, 1].map((y) =>
              new Vector3((x * placed.height * CARD_RATIO) / 2, (y * placed.height) / 2, 0)
                .applyEuler(new Euler(placed.rotationX, 0, placed.angle))
                .add(new Vector3(placed.x, placed.y, placed.z))
                .project(camera),
            ),
          );
          const xs = points.map((point) => ((point.x + 1) * view.width) / 2);
          const ys = points.map((point) => ((1 - point.y) * view.height) / 2);
          expect(Math.min(...xs)).toBeCloseTo(expected.left, 4);
          expect(Math.min(...ys)).toBeCloseTo(expected.top, 4);
          expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(expected.width, 4);
          expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(expected.height, 4);
        }
      }
    }
  });

  test(`a lifted hand card remains reachable without a focus target below the viewport at ${view.width}x${view.height}`, () => {
    const resting = handScreenBounds(handScreenSlot(3, 7, false, view));
    const lifted = handScreenBounds(handScreenSlot(3, 7, false, view, true));
    const hit = handHitBounds(lifted, resting, view);
    expect(resting.top + resting.height).toBeGreaterThan(view.height);
    expect(lifted.top).toBeLessThan(resting.top);
    expect(lifted.top + lifted.height).toBeCloseTo(view.height, 6);
    expect(hit.top).toBe(lifted.top);
    expect(hit.top + hit.height).toBe(view.height);
    expect(hit.left).toBeLessThanOrEqual(resting.left);
    expect(hit.left + hit.width).toBeGreaterThanOrEqual(resting.left + resting.width);
  });

  test(`front cards fully cover rear borders and cues at ${view.width}x${view.height}`, () => {
    for (const [distance, tilt, fov] of [
      [1300, -400, 35],
      [2700, -850, 55],
    ]) {
      const camera = new PerspectiveCamera(fov, view.width / view.height, 100, 4000);
      camera.position.set(0, tilt, distance);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      const direction = camera.getWorldDirection(new Vector3());
      const depth = (placed: PlacedCard, localZ: number) =>
        new Vector3(0, 0, localZ)
          .multiplyScalar(placed.height * CARD_RATIO)
          .applyEuler(new Euler(placed.rotationX, 0, placed.angle))
          .add(new Vector3(placed.x, placed.y, placed.z))
          .sub(camera.position)
          .dot(direction);
      for (let index = 1; index < 7; index++) {
        const rear = handPlacement(card, index - 1, 7, false, { ...view, camera });
        const front = handPlacement(card, index, 7, false, { ...view, camera });
        // Test the renderer's complete local depth range, beyond the border alone.
        expect(depth(front, -0.014)).toBeLessThan(depth(rear, 0.06));
        expect(depth(front, 0.002)).toBeLessThan(depth(rear, 0.003));
      }
    }
  });
}

test("Clash and Clashground keep the same inset while the contender keeps its frame size", () => {
  const board: LiveBoardState = {
    cards: ["clash", "contender", "clashground"].map((zone) => ({
      ...card.card,
      zone,
      instanceId: zone,
    })),
    players: {
      "player-one": { name: "You", health: 30, maxHealth: 30, handSize: 0, deckSize: 30 },
      "player-two": { name: "Opponent", health: 30, maxHealth: 30, handSize: 0, deckSize: 30 },
    },
    activePlayer: "player-one",
    turnNumber: 1,
    phaseName: "primary",
    portalOpen: false,
    clash: null,
    standbyCount: 0,
  };
  for (const compact of [false, true]) {
    const placed = arenaLayout(board, "player-one", compact, 0, 1000);
    const clash = placed.find((entry) => entry.card.zone === "clash")!;
    const ground = placed.find((entry) => entry.card.zone === "clashground")!;
    const contender = placed.find((entry) => entry.card.zone === "contender")!;
    expect(clash.height).toBe(ground.height);
    expect(clash.height).toBeLessThan(contender.height);
  }
});
