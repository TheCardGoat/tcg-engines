import { describe, expect, test } from "vite-plus/test";
import { st05UnionArmada017, st05Ann003, st05Shanks001, st05DouglasBullet011 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-017 Union Armada", () => {
  test("restores the Counter choice and protects the same FILM Character without another target choice", () => {
    let engine = OnePieceTestEngine.create(
      { character: [{ card: st05DouglasBullet011, playedOnTurn: 0 }] },
      {
        leaderCardId: st05Shanks001,
        character: [{ card: st05Ann003, rested: true }],
        hand: [st05UnionArmada017],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attacker = engine.findCardInZone("south", "character", st05DouglasBullet011);
    const defender = engine.findCardInZone("north", "character", st05Ann003);
    const counter = engine.findCardInZone("north", "hand", st05UnionArmada017);
    engine.declareAttack(attacker, defender);
    engine.resolveDecision("battleCounter", { selectedIds: [counter] }, "north");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [defender] }, "north");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === defender),
    ).toBe(true);
  });
  test("protection persists against effect KO and expires next turn", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st05DouglasBullet011, playedOnTurn: 0 }],
        hand: ["ST04-015", "ST04-015"],
        activeDon: 10,
      },
      {
        leaderCardId: st05Shanks001,
        character: [{ card: st05Ann003, rested: true }, "ST05-009"],
        hand: [st05UnionArmada017],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ann = e.findCardInZone("north", "character", st05Ann003);
    const scarlet = e.findCardInZone("north", "character", "ST05-009");
    e.asSouth().attack(e.findCardInZone("south", "character", st05DouglasBullet011), ann);
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", st05UnionArmada017)] },
      "north",
    );
    e.asNorth().chooseTargets(ann);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === ann)?.power,
    ).toBe(3000);
    e.asSouth().play("ST04-015");
    e.asSouth().chooseTargets(ann);
    e.asSouth().chooseAddDon(0);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toEqual(
      expect.arrayContaining([ann, scarlet]),
    );
    e.endTurn("south");
    e.endTurn("north");
    e.asSouth().play("ST04-015");
    e.asSouth().chooseTargets(ann);
    e.asSouth().chooseAddDon(0);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(ann);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(
      scarlet,
    );
  });
  test.each([true, false])("FILM Leader selection=%s opens no protection choice", (select) => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st05DouglasBullet011, playedOnTurn: 0 }] },
      {
        leaderCardId: st05Shanks001,
        character: ["ST05-009", "ST04-002"],
        hand: [st05UnionArmada017],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(
      e.findCardInZone("south", "character", st05DouglasBullet011),
      e.leader("north"),
    );
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", st05UnionArmada017)] },
      "north",
    );
    const step = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw Error("Expected FILM selection");
    expect(step.candidates.map((c) => c.ref.id)).toEqual(
      expect.arrayContaining([
        e.leader("north"),
        e.findCardInZone("north", "character", "ST05-009"),
      ]),
    );
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("north", "character", "ST04-002"),
    );
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: select ? [e.leader("north")] : [] },
      "north",
    );
    expect(e.getView("north").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.activeDon).toBe(0);
  });
  test("Life Trigger adds an active DON without a Counter target", () => {
    const e = OnePieceTestEngine.create(
      { life: [st05UnionArmada017] },
      { character: [{ card: st05DouglasBullet011, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", st05DouglasBullet011),
      e.leader("south"),
    );
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseAddDon(1);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
