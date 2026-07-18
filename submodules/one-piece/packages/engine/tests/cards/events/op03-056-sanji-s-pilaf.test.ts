import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op03SanjiSPilaf056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const DRAW_DECK = [eb01Doma005, eb01Fourtricks025, eb01Sanji014, eb01MountainGod018] as const;

describe("OP03-056 Sanji's Pilaf", () => {
  test("pays for Main and draws exactly the top 2 cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03SanjiSPilaf056],
      deck: [...DRAW_DECK],
      activeDon: 3,
    });
    const eventId = engine.findCardInZone("south", "hand", op03SanjiSPilaf056);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op03SanjiSPilaf056);

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main and draws 2 without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [...DRAW_DECK],
        life: [op03SanjiSPilaf056],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const activeDonBefore = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.north.activeDon).toBe(activeDonBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
