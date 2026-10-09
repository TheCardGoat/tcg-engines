import { expect, test } from "vitest";
import { arenaLayout } from "./components/Arena3D/layout";
import {
  createResourceStepFixture,
  resourceBoard,
  resourceCandidates,
  submitResourceStep,
} from "./resource-step-fixture";
test("dry-run candidates preserve state and exclude Rivaled and duplicate Bound", () => {
  const engine = createResourceStepFixture();
  const before = structuredClone(engine.state);
  const candidates = resourceCandidates(engine);
  expect(candidates.filter((c) => c.eligible)).toHaveLength(3);
  expect(candidates.find((c) => c.card.name === "Ultimate Power Armor")?.reason).toContain(
    "Rivaled",
  );
  expect(candidates.find((c) => c.card.name === "Cadavros")?.reason).toContain("Bound");
  expect(engine.state).toEqual(before);
});
test("native deployment moves one card ready and closes the step", () => {
  const engine = createResourceStepFixture();
  const card = resourceCandidates(engine).find((c) => c.eligible)!.card;
  expect(submitResourceStep(engine, card.instanceId).success).toBe(true);
  const board = resourceBoard(engine);
  expect(board.cards.find((c) => c.instanceId === card.instanceId)).toMatchObject({
    zone: "resource",
    ready: true,
  });
  expect(board.players["player-one"].handSize).toBe(4);
  expect(board.phaseName).toBe("primary");
  expect(submitResourceStep(engine).success).toBe(false);
  expect(submitResourceStep(engine, resourceCandidates(engine)[0].card.instanceId).success).toBe(
    false,
  );
});
test("illegal resource commands preserve hand and resource step", () => {
  const engine = createResourceStepFixture();
  for (const candidate of resourceCandidates(engine).filter((c) => !c.eligible)) {
    expect(submitResourceStep(engine, candidate.card.instanceId).success).toBe(false);
    expect(
      resourceBoard(engine).cards.find((c) => c.instanceId === candidate.card.instanceId)?.zone,
    ).toBe("hand");
  }
  expect(resourceBoard(engine).players["player-one"].handSize).toBe(5);
  expect(resourceBoard(engine).phaseName).toBe("expansion");
});
test("skip preserves hand and resources and closes the step", () => {
  const engine = createResourceStepFixture();
  const before = resourceBoard(engine);
  expect(submitResourceStep(engine).success).toBe(true);
  const after = resourceBoard(engine);
  expect(after.cards).toEqual(before.cards);
  expect(after.phaseName).toBe("primary");
  expect(submitResourceStep(engine).success).toBe(false);
});

test("resources use an inverted pose and retain their public artwork identity", () => {
  const board = resourceBoard(createResourceStepFixture());
  const resources = arenaLayout(board, "player-one", false, 0, 1050).filter(
    (p) => p.card.zone === "resource",
  );
  expect(resources).toHaveLength(3);
  for (const placed of resources) {
    expect(placed.angle).toBe(Math.PI);
    expect(placed.card.definitionId).toBeTruthy();
    expect(placed.card.faceDown).toBe(false);
  }
});

test("interaction availability matches native eligibility for resource cards", async () => {
  const { availableInteractionCardIds } = await import("@tcg/simulator-presentation/selection");
  const engine = createResourceStepFixture();
  const view = engine.getInteractionView("human");
  const available = availableInteractionCardIds(view);
  const candidates = resourceCandidates(engine);
  for (const candidate of candidates)
    expect(available.has(candidate.card.instanceId)).toBe(candidate.eligible);
  expect(available.size).toBe(3);
});

for (const compact of [false, true]) {
  test(`five-card fan preserves readable spacing within available width (${compact ? "compact" : "desktop"})`, () => {
    const board = resourceBoard(createResourceStepFixture());
    const width = compact ? 700 : 1120;
    const hand = arenaLayout(board, "player-one", compact, 0, width).filter((p) => p.hand);
    expect(hand).toHaveLength(5);
    for (let i = 1; i < hand.length; i++)
      expect(hand[i].x - hand[i - 1].x).toBeGreaterThan(((hand[i].height * 5) / 7) * 0.85);
    expect(hand.at(-1)!.x - hand[0].x + (hand[0].height * 5) / 7).toBeLessThanOrEqual(
      width * 0.9 + 0.001,
    );
  });
}
