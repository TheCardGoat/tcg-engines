import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Koby098,
  op04Kaido044,
  op05DonquixoteRosinante030,
} from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-030 Donquixote Rosinante", () => {
  test("has separate Navy and Donquixote Pirates types", () => {
    expect(op05DonquixoteRosinante030.traits).toEqual(["Navy", "Donquixote Pirates"]);
  });

  test("on the opponent's turn may trash itself instead of a rested ally's battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05DonquixoteRosinante030, { card: eb01Doma005, rested: true }] },
      { character: [{ card: op04Kaido044, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op05DonquixoteRosinante030);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op04Kaido044);

    engine.declareAttack(attackerId, allyId, "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(allyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rosinanteId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(allyId);
  });

  test("one trash replaces both simultaneous K.O.s of rested allies", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op05DonquixoteRosinante030, rested: true },
          { card: eb01Doma005, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const [rosinanteId, firstAllyId, secondAllyId] = engine.getState().players.south
      .characterArea as [string, string, string];
    processEffectAction(
      engine.getState(),
      "north",
      engine.leader("north"),
      {
        action: "ko",
        target: {
          player: "any",
          zones: ["character"],
          count: { amount: "all" },
        },
      },
      [rosinanteId, firstAllyId, secondAllyId],
    );
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rosinanteId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([firstAllyId, secondAllyId]),
    );
  });

  test("may trash itself instead when another rested Character would be effect K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05DonquixoteRosinante030, { card: eb01Doma005, rested: true }] },
      { hand: [op02Koby098, eb01Fourtricks025], activeDon: op02Koby098.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op05DonquixoteRosinante030);
    const protectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rosinanteId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
  });

  test("does not replace the K.O. of an active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05DonquixoteRosinante030, eb01Doma005] },
      { hand: [op02Koby098, eb01Fourtricks025], activeDon: op02Koby098.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op05DonquixoteRosinante030);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(rosinanteId);
  });
});
