// @vitest-environment jsdom
import { render, cleanup } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { Group, PerspectiveCamera } from "three";
import { OpeningMotion, useOpeningCardMotion } from "./OpeningMotion";
import { openingReplacement, openingReview, openingSettle } from "./opening-beats";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import { arenaLayout, CARD_RATIO } from "./layout";
import { openingPlacement } from "./opening-layout";
import { parseProjectedState } from "../../pages/LiveMatch.page";
import type { ArenaOpening } from "./useArenaOpening";

const frames = vi.hoisted(() => new Map<number, (state?: unknown, delta?: number) => void>());
vi.mock("@react-three/fiber", () => ({
  useFrame: (callback: (state?: unknown, delta?: number) => void, priority = 0) =>
    frames.set(priority, callback),
  useThree: (select?: (state: unknown) => unknown) => {
    const state = {
      camera: new PerspectiveCamera(45, 1.2, 1, 5000),
      size: { width: 900, height: 800 },
      invalidate: () => {},
    };
    state.camera.position.set(0, -800, 1000);
    state.camera.lookAt(0, 0, 0);
    return select ? select(state) : state;
  },
}));
afterEach(() => {
  cleanup();
  frames.clear();
});

test.each(["return", "reshuffle", "redraw"])(
  "%s uses its opening origin despite a resting-pose reset",
  (beatId) => {
    const engine = createAlphaClashVisualFixture("opening-preview");
    const board = parseProjectedState(engine.getViewerState({ role: "player", actorId: "human" }))!;
    const placed = arenaLayout(board, "player-one", false, 0, 700).find(
      (entry) => entry.hand && entry.card.controller === "player-one",
    )!;
    const group = new Group();
    const ref = { current: group };
    function Card() {
      useOpeningCardMotion(ref, placed, false, 0, 8, false, 1, false);
      return null;
    }
    const opening: ArenaOpening = {
      beat: openingReview(8, 8),
      retainedIds: new Set(),
      handOrder: [],
      advance: vi.fn(),
      redraw: vi.fn(),
      declare: vi.fn(),
      keep: vi.fn(),
      cancel: vi.fn(),
    };
    const element = () => (
      <OpeningMotion opening={{ ...opening }} reduced={false}>
        <Card />
      </OpeningMotion>
    );
    const rendered = render(element());
    group.position.set(-280, 180, 350);
    group.scale.setScalar(150);
    frames.get(0)!();
    // Simulate the generic resting hook running before the opening layout effect.
    group.position.set(0, -365, 20);
    group.scale.setScalar(80);
    opening.beat = openingReplacement(8, 8, 1).find((beat) => beat.id === beatId)!;
    rendered.rerender(element());
    frames.get(0)!();
    if (beatId === "reshuffle") {
      expect(group.position.toArray()).toEqual([-280, 180, 350]);
      expect(group.scale.x).toBeCloseTo(150);
    } else {
      const camera = new PerspectiveCamera(45, 1.2, 1, 5000);
      camera.position.set(0, -800, 1000);
      camera.lookAt(0, 0, 0);
      const origin = openingPlacement(
        placed,
        { ...opening.beat, hand: beatId === "return" ? "review" : "deck" },
        false,
        0,
        8,
        false,
        { camera, viewportAspect: 900 / 800 },
      );
      expect(group.position.x).toBeCloseTo(origin.x);
      expect(group.position.y).toBeCloseTo(origin.y);
      expect(group.position.z).toBeCloseTo(origin.z);
      expect(group.scale.x).toBeCloseTo(origin.height * CARD_RATIO);
    }
  },
);

test.each(["opponent hand", "contender", "kept card"])(
  "%s stays fixed throughout all replacement beats",
  (kind) => {
    const engine = createAlphaClashVisualFixture("opening-preview");
    const board = parseProjectedState(engine.getViewerState({ role: "player", actorId: "human" }))!;
    const placed = arenaLayout(board, "player-one", false, 0, 700).find((entry) =>
      kind === "contender"
        ? entry.card.zone === "contender"
        : entry.hand &&
          entry.card.controller === (kind === "opponent hand" ? "player-two" : "player-one"),
    )!;
    const group = new Group();
    group.position.set(120, 230, 40);
    group.rotation.set(0.25, 0, 0.1);
    group.scale.setScalar(90);
    const ref = { current: group };
    const opening: ArenaOpening = {
      beat: openingReview(8, 8),
      retainedIds: new Set(kind === "kept card" ? [placed.card.instanceId] : []),
      handOrder: [],
      advance: vi.fn(),
      redraw: vi.fn(),
      declare: vi.fn(),
      keep: vi.fn(),
      cancel: vi.fn(),
    };
    function Card() {
      useOpeningCardMotion(ref, placed, kind === "opponent hand", 0, 8, false, 1, false);
      return null;
    }
    const element = () => (
      <OpeningMotion opening={{ ...opening }} reduced={false}>
        <Card />
      </OpeningMotion>
    );
    const rendered = render(element());
    // The normal resting hook owns this pose, including the contender tilt.
    group.position.set(120, 230, 40);
    group.rotation.set(0.25, 0, 0.1);
    group.scale.setScalar(90);
    const pose = () => [
      ...group.position.toArray(),
      ...group.quaternion.toArray(),
      ...group.scale.toArray(),
    ];
    frames.get(0)!();
    const resting = pose();
    for (const beat of [
      ...openingReplacement(8, 8, 2),
      ...(kind === "kept card" ? [] : [openingSettle(8, 8, "You start")]),
    ]) {
      opening.beat = beat;
      // The generic pose hook may snap when entering a timed animation.
      group.position.set(0, -365, 20);
      group.rotation.set(0, 0, 0);
      rendered.rerender(element());
      expect(pose()).toEqual(resting);
      for (let frame = 0; frame < 12; frame++) {
        frames.get(-2)!(undefined, 0.03);
        frames.get(0)!();
        expect(pose()).toEqual(resting);
      }
    }
  },
);

test("loading artwork does not consume the opening beat", () => {
  const opening: ArenaOpening = {
    beat: { ...openingReview(8, 8), id: "contenders", duration: 100 },
    retainedIds: new Set(),
    handOrder: [],
    advance: vi.fn(),
    redraw: vi.fn(),
    declare: vi.fn(),
    keep: vi.fn(),
    cancel: vi.fn(),
  };
  const rendered = render(
    <OpeningMotion opening={opening} reduced={false} paused>
      {null}
    </OpeningMotion>,
  );
  for (let i = 0; i < 20; i++) frames.get(-2)!(undefined, 0.05);
  expect(opening.advance).not.toHaveBeenCalled();
  rendered.rerender(
    <OpeningMotion opening={opening} reduced={false}>
      {null}
    </OpeningMotion>,
  );
  frames.get(-2)!(undefined, 0.05);
  expect(opening.advance).not.toHaveBeenCalled();
  frames.get(-2)!(undefined, 0.05);
  expect(opening.advance).toHaveBeenCalledExactlyOnceWith("contenders");
});
