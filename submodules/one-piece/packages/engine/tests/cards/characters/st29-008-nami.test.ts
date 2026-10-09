import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-008 Nami", () => {
  test.each(["ST29-008", "ST29-010"])(
    "turns only top Life face up instead of opponent effect KO of %s",
    (card) => {
      let e = OnePieceTestEngine.create(
        { hand: ["OP04-038"], activeDon: 5 },
        {
          character: [
            { cardId: "ST29-008", rested: true },
            ...(card === "ST29-008" ? [] : [{ cardId: card, rested: true }]),
          ],
          life: ["ST02-002", "ST02-006"],
        },
      );
      const target = e.findCardInZone("north", "character", card),
        life = [...e.getState().players.north.life];
      e.asSouth().play("OP04-038");
      e.asSouth().chooseTargets();
      e.asSouth().chooseTargets(target);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
      expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(
        target,
      );
      expect(e.getState().players.north.life).toEqual(life);
      expect(e.getState().cards[life[0]!]!.faceUp).toBe(true);
      expect(e.getState().cards[life[1]!]!.faceUp).toBe(false);
    },
  );
  test.each(["empty", "top face up"])("cannot pay with %s even if bottom face down", (kind) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      {
        character: [{ cardId: "ST29-008", rested: true }],
        life: kind === "empty" ? [] : [{ cardId: "ST02-002", faceUp: true }, "ST02-006"],
      },
    );
    const target = e.findCardInZone("north", "character", "ST29-008");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("declines optional KO replacement and keeps Life hidden", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "ST29-008", rested: true }], life: ["ST02-002", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST29-008"),
      life = [...e.getState().players.north.life];
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getState().cards[life[0]!]!.faceUp).toBe(false);
  });
  test("battle KO is not replaceable", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "ST29-008", rested: true }], life: 2 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const target = e.findCardInZone("north", "character", "ST29-008");
    e.asSouth().attack(e.leader("south"), target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("opponent non-KO removal is not replaceable", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST29-008"], life: 2 },
    );
    const target = e.findCardInZone("north", "character", "ST29-008");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(target);
    expect(e.getState().players.north.deck.at(-1)).toBe(target);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("wrong trait is not protected", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: ["ST29-008", { cardId: "ST02-002", rested: true }], life: 2 },
    );
    const target = e.findCardInZone("north", "character", "ST02-002");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("own effect KO cost is not replaceable", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST29-008", { cardId: "OP05-087", attachedDon: 1 }], life: 2 },
      {},
      { activeSeat: "south", firstPlayer: "north" },
    );
    const target = e.findCardInZone("south", "character", "ST29-008"),
      source = e.findCardInZone("south", "character", "OP05-087");
    e.asSouth().attack(source, e.leader("north"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test.each(["ST29-001", "ST02-001"])("Trigger Leader gate %s", (leader) => {
    const e = OnePieceTestEngine.create(
      {},
      { leaderCardId: leader, life: ["ST29-008", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const id = e.findCardInZone("north", "life", "ST29-008");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      leader === "ST29-001",
    );
  });
  test("replacement has no turn limit after top Life is removed by damage", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      {
        character: [{ cardId: "ST29-008", rested: true }],
        life: ["ST02-002", "ST02-006", "ST02-012"],
      },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const target = e.findCardInZone("north", "character", "ST29-008"),
      life = [...e.getState().players.north.life];
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(life[0]);
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(target);
    expect(e.getState().cards[life[1]!]!.faceUp).toBe(true);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
