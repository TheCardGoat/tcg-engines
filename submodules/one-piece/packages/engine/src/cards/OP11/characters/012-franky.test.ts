import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01RadicalBeam029,
  op02IceAge117,
  op11Franky012,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-012 Franky", () => {
  test("on its turn boosts all Characters only once after opposing Event Counters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op11Franky012,
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { hand: [op01RadicalBeam029, op01RadicalBeam029], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const frankyId = engine.findCardInZone("south", "character", op11Franky012);
    const attackerIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);
    const eventIds = engine
      .getView("north")
      .players.north.hand.filter((card) => card.cardId === op01RadicalBeam029.id)
      .map((card) => card.instanceId);

    engine.declareAttack(attackerIds[0]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[0]!] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === frankyId)?.power).toBe(
      6000,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === attackerIds[1])?.power,
    ).toBe(9000);

    engine.asNorth().chooseCounter();
    engine.declareAttack(attackerIds[1]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[1]!] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === frankyId)?.power).toBe(
      6000,
    );
  });

  test("does not trigger from an opposing Main Event outside its controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Franky012] },
      { hand: [op02IceAge117], activeDon: op02IceAge117.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op11Franky012);

    engine.playCard(op02IceAge117, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === frankyId)
        ?.power,
    ).toBe(4000);
  });
  test("FAQ: Red Hawk KOs Franky before its Event reaction can boost the field", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP11-012", "ST02-012"] },
      { hand: ["OP01-026"], activeDon: 2 },
    );
    const franky = e.findCardInZone("south", "character", "OP11-012");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter(e.findCardInZone("north", "hand", "OP01-026"));
    e.asNorth().chooseTargets(e.leader("north"));
    e.asNorth().chooseTargets(franky);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(franky);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "ST02-012")?.power,
    ).toBe(3000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: an opponent Event Life Trigger does not activate Franky's power effect", () => {
    const e = OnePieceTestEngine.create({ character: ["OP11-012"] }, { life: ["ST06-016"] });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
