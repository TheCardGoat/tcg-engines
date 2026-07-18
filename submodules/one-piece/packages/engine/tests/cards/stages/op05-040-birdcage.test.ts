import { describe, expect, test } from "vite-plus/test";
import {
  op01DonquixoteDoflamingo060,
  op05Birdcage040,
  op13Hack090,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-040 Birdcage", () => {
  test("with Donquixote Doflamingo, keeps both players' rested cost-5-or-less Characters rested", () => {
    const unavailableEngine = OnePieceTestEngine.create({
      stage: op05Birdcage040,
      character: [{ card: op13Higuma013, rested: true }],
    });
    unavailableEngine.endTurn("south");
    unavailableEngine.endTurn("north");
    expect(unavailableEngine.getView("south").players.south.characters[0]?.rested).toBe(false);

    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        stage: op05Birdcage040,
        character: [
          { card: op13Higuma013, rested: true },
          { card: op13Hack090, rested: true },
        ],
      },
      {
        character: [
          { card: op13Higuma013, rested: true },
          { card: op13Hack090, rested: true },
        ],
      },
    );

    engine.endTurn("south");
    let view = engine.getView("south");
    expect(view.players.north.characters.slice(0, 2).map((card) => card?.rested)).toEqual([
      true,
      false,
    ]);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.slice(0, 2).map((card) => card?.rested)).toEqual([
      true,
      false,
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  // Official OP05 Q&A Q518-Q519: this End of Your Turn effect works without a
  // Donquixote Doflamingo Leader and always activates when the 10-DON!! condition is met.
  test("without Doflamingo, mandatorily K.O.s the low-cost rested field at 10 DON!! and trashes itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op05Birdcage040,
        activeDon: 10,
        character: [
          { card: op13Higuma013, rested: true },
          { card: op13Hack090, rested: true },
        ],
      },
      {
        character: [
          { card: op13Higuma013, rested: true },
          { card: op13Hack090, rested: true },
        ],
      },
    );
    const stageId = engine.findCardInZone("south", "stage", op05Birdcage040);
    const southLowId = engine.findCardInZone("south", "character", op13Higuma013);
    const southHighId = engine.findCardInZone("south", "character", op13Hack090);
    const northLowId = engine.findCardInZone("north", "character", op13Higuma013);
    const northHighId = engine.findCardInZone("north", "character", op13Hack090);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.stage).toBeNull();
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([stageId, southLowId]),
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(northLowId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(southHighId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(northHighId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
