import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op05BartholomewKuma011,
  prb02PlasticSurgeryShotSt12017PirateFoil017,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST12-017 Plastic Surgery Shot reprint", () => {
  test("Counter grants +2000, reveals the top cost-2 Character, and lets the defender play it", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      {
        hand: [prb02PlasticSurgeryShotSt12017PirateFoil017],
        deck: [op05BartholomewKuma011, eb01Doma005],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      prb02PlasticSurgeryShotSt12017PirateFoil017,
    );
    const playId = engine.findCardInZone("north", "deck", op05BartholomewKuma011);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(
      engine.getView("north").players.north.characters.some((card) => card?.instanceId === playId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("declining the revealed play lets the defender put that card on deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      {
        hand: [prb02PlasticSurgeryShotSt12017PirateFoil017],
        deck: [op05BartholomewKuma011, eb01Doma005],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      prb02PlasticSurgeryShotSt12017PirateFoil017,
    );
    const revealedId = engine.findCardInZone("north", "deck", op05BartholomewKuma011);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "north");
    expect(engine.getState().players.north.deck.at(-1)).toBe(revealedId);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
