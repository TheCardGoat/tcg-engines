import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Shanks120,
  op07JewelryBonney019,
  op07Urouge021,
} from "@tcg/op-cards";
import { op12RoronoaZoro113 } from "../../../../../cards/src/cards/OP12/characters/113-roronoa-zoro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-113 Roronoa Zoro", () => {
  test("on K.O. plays an eligible Supernovas Character from hand rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07JewelryBonney019,
        hand: [op07Urouge021, eb01Doma005],
        character: [{ card: op12RoronoaZoro113, rested: true }],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zoroId = engine.findCardInZone("south", "character", op12RoronoaZoro113);
    const eligibleId = engine.findCardInZone("south", "hand", op07Urouge021);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(
      engine.findCardInZone("north", "character", op01Shanks120),
      zoroId,
      "north",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Zoro's play target.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === eligibleId),
    ).toMatchObject({ rested: true });
  });

  test("its Life Trigger K.O.s an opponent cost-1 Character and adds itself to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Doma005, eb01MountainGod018] },
      { life: [op12RoronoaZoro113] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const zoroId = engine.findCardInZone("north", "life", op12RoronoaZoro113);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Zoro's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(zoroId);
  });
});
