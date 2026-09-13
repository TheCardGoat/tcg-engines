import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02TrafalgarLaw045,
  op03Nami040,
  op04WeaknessIsAnUnforgivableSin076,
  op06Zeff048,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-048 Zeff", () => {
  test("during its controller's turn may trash four when the opponent activates Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Nami040,
        character: [
          { card: op06Zeff048, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb02TrafalgarLaw045, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("north", "character", eb02TrafalgarLaw045);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ deckCount: 1 });
    expect(engine.getView("south").players.south.trash).toHaveLength(4);
  });

  test("during its controller's turn may trash four when the opponent activates a Counter Event", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Nami040,
        character: [
          { card: op06Zeff048, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { hand: [op04WeaknessIsAnUnforgivableSin076], activeDon: 4 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op04WeaknessIsAnUnforgivableSin076);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.acceptLeadingOptional("north");
    const returnDon = engine.pendingDecision("effectCostReturnDon", "north").steps[0];
    expect(returnDon?.kind).toBe("payCost");
    if (returnDon?.kind !== "payCost") throw new Error("Expected the Event's DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [returnDon.candidates[0]!.ref.id] },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ deckCount: 1 });
    expect(engine.getView("south").players.south.trash).toHaveLength(4);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Nami040,
        character: [
          { card: op06Zeff048, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb02TrafalgarLaw045, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("north", "character", eb02TrafalgarLaw045);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
