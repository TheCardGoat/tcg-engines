import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Shanks120,
  op08BurnBlade117,
  op09BonkPunch010,
  op09Monster012,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-012 Monster", () => {
  test("trashes the physical Monster instead when Bonk Punch would be K.O.'d by an effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09BonkPunch010, op09Monster012] },
      { hand: [op08BurnBlade117], life: [eb01Doma005], activeDon: 5 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonkPunchId = engine.findCardInZone("south", "character", op09BonkPunch010);
    const monsterId = engine.findCardInZone("south", "character", op09Monster012);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bonkPunchId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === bonkPunchId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === monsterId)).toBe(
      false,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(monsterId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace Bonk Punch's battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09BonkPunch010, rested: true }, op09Monster012],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonkPunchId = engine.findCardInZone("south", "character", op09BonkPunch010);
    const monsterId = engine.findCardInZone("south", "character", op09Monster012);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, bonkPunchId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bonkPunchId);
    expect(view.players.south.characters.some((card) => card?.instanceId === monsterId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace an effect K.O. of another Character name", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Doma005, op09Monster012] },
      { hand: [op08BurnBlade117], life: [eb01Doma005], activeDon: 5 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const monsterId = engine.findCardInZone("south", "character", op09Monster012);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.south.characters.some((card) => card?.instanceId === monsterId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
