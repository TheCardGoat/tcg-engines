import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Inuppe082,
  op06Oars083,
  op12Perona034,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Oinkchuck082 } from "../../../../../cards/src/cards/OP14EB04/characters/082-oinkchuck.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-082 Oinkchuck", () => {
  test("on K.O. gives all own included Thriller Bark Pirates Characters +4 cost through the opponent's End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Oinkchuck082, op12Perona034, op06Inuppe082, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      {
        hand: [op12UrsaShock096],
        activeDon: op12UrsaShock096.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const oinkchuckId = engine.findCardInZone("south", "character", op14eb04Oinkchuck082);
    const includedTraitId = engine.findCardInZone("south", "character", op12Perona034);
    const exactTraitId = engine.findCardInZone("south", "character", op06Inuppe082);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [oinkchuckId] }, "north");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(oinkchuckId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === includedTraitId)?.cost,
    ).toBe(op12Perona034.cost + 4);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === exactTraitId)?.cost,
    ).toBe(op06Inuppe082.cost + 4);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wrongTraitId)?.cost,
    ).toBe(eb01Doma005.cost);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === includedTraitId)?.cost,
    ).toBe(op12Perona034.cost + 4);
    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === exactTraitId)?.cost,
    ).toBe(op06Inuppe082.cost + 4);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === includedTraitId)?.cost,
    ).toBe(op12Perona034.cost);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === exactTraitId)?.cost,
    ).toBe(op06Inuppe082.cost);
  });

  test("Life Trigger offers its controller only cost-2-or-less Thriller Bark Pirates Characters from their trash and plays the selected identity rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Oinkchuck082, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op12Perona034, op06Inuppe082, op06Oars083, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Oinkchuck082);
    const includedTraitId = engine.findCardInZone("north", "trash", op12Perona034);
    const exactTraitId = engine.findCardInZone("north", "trash", op06Inuppe082);
    const highCostId = engine.findCardInZone("north", "trash", op06Oars083);
    const wrongTraitId = engine.findCardInZone("north", "trash", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectPlaySelection", "north");
    expect(decision.actorId).toBe("north");
    const play = decision.steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Oinkchuck's trash play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      includedTraitId,
      exactTraitId,
    ]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(triggerId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [includedTraitId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === includedTraitId),
    ).toMatchObject({ cardId: op12Perona034.id, rested: true });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(exactTraitId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger may decline the optional trash play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Oinkchuck082, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op06Inuppe082],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const candidateId = engine.findCardInZone("north", "trash", op06Inuppe082);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(candidateId);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
