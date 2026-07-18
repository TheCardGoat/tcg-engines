import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb03Nami006,
  op04SuperSpotBilledDuckTroops009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-009 Super Spot-Billed Duck Troops", () => {
  test("can reduce a zero-power Leader and returns itself only at end of turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Nami006],
        character: [{ card: op04SuperSpotBilledDuckTroops009, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: eb03Nami006.cost,
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const troopsId = engine.findCardInZone("south", "character", op04SuperSpotBilledDuckTroops009);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb03Nami006, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(0);

    engine.declareAttack(troopsId, targetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(-5000);
    expect(view.players.south.characters.some((card) => card?.instanceId === troopsId)).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(troopsId);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === troopsId)).toBe(false);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(troopsId);
  });

  test("may decline without reducing the Leader or scheduling the return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04SuperSpotBilledDuckTroops009, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const troopsId = engine.findCardInZone("south", "character", op04SuperSpotBilledDuckTroops009);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(troopsId, targetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);

    engine.endTurn("south");
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === troopsId)).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(troopsId);
  });

  test("cannot pay the power cost after its Leader has attacked and become rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04SuperSpotBilledDuckTroops009, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const troopsId = engine.findCardInZone("south", "character", op04SuperSpotBilledDuckTroops009);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.declareAttack(troopsId, targetId, "south");

    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    const view = engine.getView("south");
    expect(view.players.south.leader).toMatchObject({ rested: true, power: 5000 });
    expect(view.prompts).toHaveLength(0);
    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === troopsId),
    ).toBe(true);
  });
});
