import { describe, expect, test } from "vite-plus/test";
import { createMatch, OnePieceTestEngine } from "../../../src/index.ts";

const leader = "EVENT-LEADER-MONKEY-D-LUFFY";

describe("Unnumbered designated-event Monkey.D.Luffy Leader", () => {
  test("real setup deals the current official five Life after keeping opening hands", () => {
    const e = OnePieceTestEngine.fromState(
      createMatch({
        firstPlayer: "south",
        shuffleDecks: false,
        players: {
          south: { leaderCardId: leader, mainDeck: Array(50).fill("EB01-005") },
          north: { leaderCardId: "ST01-001", mainDeck: Array(50).fill("EB01-005") },
        },
      }),
    );
    e.exec({ type: "chooseJoKenPo", seat: "south", choice: "paper" });
    e.exec({ type: "chooseJoKenPo", seat: "north", choice: "rock" });
    e.exec({ type: "chooseFirstPlayer", seat: "south", firstPlayer: "south" });
    e.exec({ type: "keepHand", seat: "south" });
    e.exec({ type: "keepHand", seat: "north" });
    e.exec({ type: "startGame", seat: "south" });
    expect(e.getView("south").players.south).toMatchObject({
      lifeCount: 5,
      handCount: 5,
      deckCount: 40,
    });
    expect(e.getView("south").players.south.leader).toMatchObject({
      name: "Monkey.D.Luffy",
      power: 5000,
    });
  });
  test.each(["EB02-012", "EB02-033"])(
    "all names grants %s its real conditional Blocker without its named companion",
    (card) => {
      const e = OnePieceTestEngine.create({}, { leaderCardId: leader, character: [card] });
      const id = e.findCardInZone("north", "character", card);
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      const p = e.pendingDecision("battleBlocker", "north").steps[0];
      if (p?.kind !== "selectEntity") throw Error("Blocker");
      expect(p.candidates.map((c) => c.ref.id)).toContain(id);
      e.asNorth().chooseBlocker(id);
      expect(e.getView("north").players.north.lifeCount).toBe(5);
      expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    },
  );
  test("all names passes the Donquixote Rosinante activation gate", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: leader,
      character: ["EB02-025"],
      activeDon: 1,
      deck: ["EB01-005", "EB01-025", "EB01-018", "EB01-005", "EB01-025", "EB01-018"],
    });
    const source = e.findCardInZone("south", "character", "EB02-025"),
      played = e.findCardInZone("south", "deck", "EB01-005");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectSearchSelection", { selectedIds: [played] }, "south");
    const step = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (step?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: step.candidates.map((c) => c.ref.id) },
      "south",
    );
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === played)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("all types passes Fish-Man or East Blue and prevents a real attack", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader, hand: ["EB02-011"], activeDon: 3 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("EB02-011");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
    e.asSouth().endTurn();
    const f = e.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: target,
      targetId: e.leader("south"),
    });
    expect(
      OnePieceTestEngine.fromState(f.state).getView("north").players.north.characters[0]?.rested,
    ).toBe(false);
  });
  test("all attributes makes the printed Strike Leader a legal Slash DON recipient", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: leader,
      character: ["EB03-014"],
      restedDon: 2,
    });
    const source = e.findCardInZone("south", "character", "EB03-014");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("Slash battle protection also recognizes the all-attribute attacker", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader },
      { character: [{ cardId: "OP03-032", rested: true }] },
    );
    const target = e.findCardInZone("north", "character", "OP03-032");
    e.asSouth().attack(e.leader("south"), target);
    expect(e.findCardInZone("north", "character", "OP03-032")).toBe(target);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test("negating Leader effects does not erase its rules name identity", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: leader,
        character: ["EB02-025"],
        activeDon: 1,
        deck: ["EB01-005", "EB01-025", "EB01-018", "EB01-005", "EB01-025", "EB01-018"],
      },
      { hand: ["OP09-097"], activeDon: 2 },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter("OP09-097");
    e.asNorth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(1000);
    e.asSouth().activateMain(e.findCardInZone("south", "character", "EB02-025"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    expect(p.candidates.filter((c) => c.legal)).toHaveLength(2);
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const step = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (step?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: step.candidates.map((c) => c.ref.id) },
      "south",
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("all names does not turn the Leader into Captain John's required Character target", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST04-003"] },
      { leaderCardId: leader, character: [{ cardId: "OP17-044", rested: true }] },
    );
    const attacker = e.findCardInZone("south", "character", "ST04-003"),
      john = e.findCardInZone("north", "character", "OP17-044");
    const f = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: attacker,
      targetId: e.leader("north"),
    });
    const restored = OnePieceTestEngine.fromState(f.state);
    restored.asSouth().attack(attacker, john);
    expect(restored.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(john);
    expect(restored.getView("north").players.north.lifeCount).toBe(5);
  });
});
