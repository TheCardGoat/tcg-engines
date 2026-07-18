import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Izo002,
  eb01MountainGod018,
  op02Vista011,
  op08Atmos040,
  op08Marco002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function payAtmosReveal(engine: OnePieceTestEngine, selectedIds: string[]) {
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const cost = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
  expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2 });
  if (cost?.kind !== "payCost") throw new Error("Expected Atmos's reveal payment.");
  const candidateIds = cost.candidates.map((candidate) => candidate.ref.id);
  expect(candidateIds).toEqual(expect.arrayContaining(selectedIds));
  engine.resolveDecision("effectCostRevealFromHand", { selectedIds }, "south");
  return candidateIds;
}

describe("OP08-040 Atmos", () => {
  test("reveals two inclusive Whitebeard Pirates cards before returning a low-cost opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Marco002,
        hand: [op08Atmos040, eb01Doma005, eb01Izo002, op02Vista011, eb01Fourtricks025],
        activeDon: op08Atmos040.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const firstRevealId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondRevealId = engine.findCardInZone("south", "hand", eb01Izo002);
    const excludedId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op08Atmos040, "south");
    const revealCandidates = payAtmosReveal(engine, [firstRevealId, secondRevealId]);
    expect(revealCandidates).not.toContain(excludedId);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Atmos's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(targetId);
    expect(
      view.logs.some(
        (entry) =>
          entry.message.includes(eb01Doma005.name) && entry.message.includes(eb01Izo002.name),
      ),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the reveal cost with a non-Whitebeard Leader before the post-colon condition fails", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Atmos040, eb01Doma005, eb01Izo002, op02Vista011],
        activeDon: op08Atmos040.cost,
      },
      { character: [eb01Doma005] },
    );
    const selectedIds = [
      engine.findCardInZone("south", "hand", eb01Doma005),
      engine.findCardInZone("south", "hand", eb01Izo002),
    ];
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op08Atmos040, "south");
    payAtmosReveal(engine, selectedIds);

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
