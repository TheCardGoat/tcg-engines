import { eb01Doma005, eb01MountainGod018, op06Inuppe082, op12Perona034 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04GeckoMoriaOp14104104 } from "../../../../../cards/src/cards/OP14EB04/characters/104-gecko-moria-op14-104.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-104 Gecko Moria", () => {
  test("on play may play an included cost-4-or-less Thriller Bark Character from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04GeckoMoriaOp14104104],
      trash: [op12Perona034, op06Inuppe082, eb01Doma005],
      activeDon: op14eb04GeckoMoriaOp14104104.cost,
    });
    const includedId = engine.findCardInZone("south", "trash", op12Perona034);
    const exactId = engine.findCardInZone("south", "trash", op06Inuppe082);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    engine.playCard(op14eb04GeckoMoriaOp14104104, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Moria's trash-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([includedId, exactId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [includedId] }, "south");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(includedId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("on play may add the selected included trash Character to top Life face-up", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04GeckoMoriaOp14104104],
      trash: [op12Perona034],
      activeDon: op14eb04GeckoMoriaOp14104104.cost,
    });
    const candidateId = engine.findCardInZone("south", "trash", op12Perona034);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.playCard(op14eb04GeckoMoriaOp14104104, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [candidateId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(engine.getState().players.south.life[0]).toBe(candidateId);
    expect(engine.getState().cards[candidateId]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger may play any cost-4-or-less Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04GeckoMoriaOp14104104, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [eb01Doma005],
        deck: [eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const candidateId = engine.findCardInZone("north", "trash", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [candidateId] }, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(candidateId);
  });
});
