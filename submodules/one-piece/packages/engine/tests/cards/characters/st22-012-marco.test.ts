import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
function ko(e: OnePieceTestEngine, id: string) {
  e.asSouth().play("OP04-038");
  e.asSouth().chooseTargets();
  e.asSouth().chooseTargets(id);
}
describe("ST22-012 Marco", () => {
  test("opponent effect KO discard replacement is once per turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      { character: [{ cardId: "ST22-012", rested: true }], hand: ["ST01-006", "ST01-006"] },
    );
    const m = e.findCardInZone("north", "character", "ST22-012"),
      paid = e.findCardInZone("north", "hand", "ST01-006");
    ko(e, m);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(m);
    ko(e, m);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(m);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("declines optional replacement and retains hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "ST22-012", rested: true }], hand: ["ST01-006"] },
    );
    const m = e.findCardInZone("north", "character", "ST22-012");
    ko(e, m);
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(m);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("own effect KO cannot use opponent replacement", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST04-001",
      hand: ["OP01-094", "ST01-006"],
      activeDon: 10,
      character: ["ST22-012"],
    });
    const m = e.findCardInZone("south", "character", "ST22-012");
    e.asSouth().play("OP01-094");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(m);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("battle KO cannot discard instead", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST22-012", rested: true }], hand: ["ST01-006"] },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const m = e.findCardInZone("south", "character", "ST22-012");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), m);
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(m);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test.each(["OP01-033", "ST02-002"])(
    "attack reveal %s controls power through opposing turn without drawing",
    (top) => {
      const e = OnePieceTestEngine.create(
        {
          character: [{ cardId: "ST22-012", playedOnTurn: 0 }],
          deck: [top, "ST02-006", "ST02-012"],
        },
        { life: 3 },
        { activeSeat: "south", firstPlayer: "north" },
      );
      const m = e.findCardInZone("south", "character", "ST22-012"),
        revealed = e.findCardInZone("south", "deck", top);
      e.asSouth().attack(m, e.leader("north"));
      expect(e.getView("south").players.south.characters[0]?.power).toBe(
        top === "OP01-033" ? 6000 : 5000,
      );
      expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(revealed);
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.characters[0]?.power).toBe(
        top === "OP01-033" ? 6000 : 5000,
      );
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    },
  );
  test("replacement resets next turn on the same Marco", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      {
        character: [{ cardId: "ST22-012", rested: true, playedOnTurn: 0 }],
        hand: ["ST01-006"],
        deck: ["ST01-006", "ST02-002", "ST02-012"],
      },
    );
    const m = e.findCardInZone("north", "character", "ST22-012");
    ko(e, m);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.asSouth().endTurn();
    e.asNorth().attack(m, e.leader("south"));
    e.asSouth().chooseCounter();
    e.asNorth().endTurn();
    ko(e, m);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(m);
    expect(e.getView("north").players.north.handCount).toBe(0);
  });
  test("opponent non-KO removal cannot use KO replacement", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST22-012"], hand: ["ST01-006"] },
    );
    const m = e.findCardInZone("north", "character", "ST22-012");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(m);
    expect(e.getState().players.north.deck.at(-1)).toBe(m);
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
