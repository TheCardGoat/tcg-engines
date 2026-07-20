import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018 } from "@tcg/op-cards";
import { prb02JewelryBonneyPrb02004004 } from "../../../../../cards/src/cards/PRB02/characters/004-jewelry-bonney-prb02-004.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("PRB02-004 Jewelry Bonney", () => {
  test("once per opponent turn may set one DON!! active and can Block a later attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02JewelryBonneyPrb02004004], restedDon: 2 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = engine.findCardInZone("south", "character", prb02JewelryBonneyPrb02004004);
    const attackerIds = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card?.instanceId)
      .filter((id): id is string => Boolean(id));
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerIds[0]!, engine.leader("south"), "north");
    const don = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    if (don?.kind !== "chooseOption") throw new Error("Expected Bonney's DON!! count choice.");
    expect(don.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });

    engine.declareAttack(attackerIds[1]!, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectSetActiveDon", "south")).toThrow();
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bonney's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bonneyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bonneyId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bonneyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero DON!! without changing the cost area", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02JewelryBonneyPrb02004004], restedDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
