import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Inuppe082,
  op06GeckoMoria086,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Ryuma089 } from "../../../../../cards/src/cards/OP14EB04/characters/089-ryuma.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-089 Ryuma", () => {
  test("on K.O. draws two then trashes two selected physical hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Ryuma089],
        hand: [eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone("south", "character", op14eb04Ryuma089);
    const handId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected exact hand trash.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [handId, drawId] },
      "south",
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sourceId, handId, drawId]),
    );
  });

  test("Life Trigger may play an included cost-4-or-less Thriller Bark Character from trash rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Ryuma089, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op06Inuppe082, op06GeckoMoria086, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const candidate = engine.findCardInZone("north", "trash", op06Inuppe082);
    const tooExpensive = engine.findCardInZone("north", "trash", op06GeckoMoria086);
    const wrongTrait = engine.findCardInZone("north", "trash", eb01Doma005);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Ryuma's trash-play choice.");
    expect(play.candidates.map((entry) => entry.ref.id)).toContain(candidate);
    expect(play.candidates.map((entry) => entry.ref.id)).not.toContain(tooExpensive);
    expect(play.candidates.map((entry) => entry.ref.id)).not.toContain(wrongTrait);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [candidate] }, "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === candidate),
    ).toMatchObject({ rested: true });
  });
});
