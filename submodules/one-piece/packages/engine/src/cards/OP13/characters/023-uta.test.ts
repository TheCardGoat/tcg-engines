import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op13MonkeyDDragon017 } from "@tcg/op-cards";
import { op13Uta023 } from "../../../../../cards/src/cards/OP13/characters/023-uta.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-023 Uta", () => {
  test("on play activates up to two DON!! then forbids base-cost-5-or-more Characters this turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Uta023, op13MonkeyDDragon017, eb01Doma005],
      activeDon: 9,
      restedDon: 2,
    });
    const restrictedId = engine.findCardInZone("south", "hand", op13MonkeyDDragon017);
    engine.playCard(op13Uta023, "south");
    const count = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(count).toMatchObject({ kind: "chooseOption", min: 1, max: 1 });
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(7);
    expect(view.players.south.restedDon).toBe(4);
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: restrictedId }).accepted,
    ).toBe(false);
    engine.playCard(eb01Doma005, "south");
  });

  test("on K.O. plays the selected cost-5-or-less Character rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Uta023, rested: true }],
        hand: [eb01Doma005, op13MonkeyDDragon017],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const utaId = engine.findCardInZone("south", "character", op13Uta023);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const expensiveId = engine.findCardInZone("south", "hand", op13MonkeyDDragon017);

    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, utaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Uta's rested play choice.");
    expect(play.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(true);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
