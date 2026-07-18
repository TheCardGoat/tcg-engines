import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07MonkeyDDragon015,
  op08Carrot021,
  op08Inuarashi022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-022 Inuarashi", () => {
  test("with a Minks Leader freezes up to two rested cost-5-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Carrot021,
        hand: [op08Inuarashi022],
        activeDon: op08Inuarashi022.cost,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
          { card: op07MonkeyDDragon015, rested: true },
          eb01Fourtricks025,
        ],
      },
    );
    const cheapId = engine.findCardInZone("north", "character", eb01Doma005);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op07MonkeyDDragon015);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op08Inuarashi022, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Inuarashi's freeze choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([cheapId, costFiveId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [cheapId, costFiveId] },
      "south",
    );

    engine.endTurn("south");
    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === cheapId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
  });

  test("with a non-Minks Leader offers no targets and does not freeze", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Inuarashi022], activeDon: op08Inuarashi022.cost },
      { character: [{ card: eb01Doma005, rested: true }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op08Inuarashi022, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.endTurn("south");

    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(false);
  });
});
