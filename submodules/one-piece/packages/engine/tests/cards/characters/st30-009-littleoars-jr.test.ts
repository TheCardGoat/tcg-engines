import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-009-littleoars-jr", () => {
  test.each([
    ["ST01-015", 4, "effectKoReplacement"],
    ["OP04-056", 6, "effectRemovalReplacement"],
    ["OP02-067", 2, "effectRemovalReplacement"],
  ] as const)(
    "replaces opposing removal %s with self-trash, DON return and draw",
    (event, cost, intent) => {
      let e = OnePieceTestEngine.create(
        {
          character: [{ cardId: "ST30-009", attachedDon: 2 }, "ST30-007"],
          deck: ["ST21-005", "ST21-006"],
        },
        { hand: [event], activeDon: cost },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const target = e.findCardInZone("south", "character", "ST30-007"),
        source = e.findCardInZone("south", "character", "ST30-009");
      e.playCard(event, "north");
      e.asNorth().chooseTargets(target);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision(intent, { optionId: "yes" }, "south");
      expect(
        e.getView("south").players.south.characters.some((c) => c?.instanceId === target),
      ).toBe(true);
      expect(e.getView("south").players.south.trash[0]?.instanceId).toBe(source);
      expect(e.getView("south").players.south.restedDon).toBe(2);
      expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    },
  );
  test("declines optional protection and keeps source plus deck", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-009", "ST30-007"], deck: ["ST21-005", "ST21-006"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST01-015", "north");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST30-007"));
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST30-009");
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-007");
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
  test("battle KO cannot be replaced", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-009", { cardId: "ST30-007", rested: true }], deck: 10 },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST15-002"),
      e.findCardInZone("south", "character", "ST30-007"),
    );
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-007");
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("replacement draw of final deck card ends match after source trash", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-009", "ST30-007"], deck: ["ST21-005"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST01-015", "north");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST30-007"));
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(e.getView("south").status).toBe("finished");
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-009");
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("simultaneous KO of mate and source resolves one replacement then source fallback", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-007", "ST30-009"], deck: ["ST21-005", "ST21-006"] },
      { leaderCardId: "OP01-091", hand: ["OP01-094"], activeDon: 10 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const mate = e.findCardInZone("south", "character", "ST30-007");
    e.playCard("OP01-094", "north");
    e.asNorth().acceptOptional();
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === mate)).toBe(
      true,
    );
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(["ST30-009"]);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("own effect KO cannot use the opponent-only replacement", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-091",
        hand: ["OP01-094"],
        activeDon: 10,
        character: ["ST30-007", "ST30-009"],
        deck: 10,
      },
      {},
    );
    e.playCard("OP01-094");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      "ST30-007",
      "ST30-009",
    ]);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("current6000 with lower base power is not protected", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          "ST30-009",
          { cardId: "ST21-011", attachedDon: 2 },
          { cardId: "ST12-011", attachedDon: 1, playedOnTurn: 0 },
        ],
        deck: 10,
      },
      { hand: ["ST01-015"], activeDon: 4 },
    );
    const target = e.findCardInZone("south", "character", "ST12-011");
    e.asSouth().attack(target, e.leader("north"));
    // No usable Counter remains, so the Counter Step ends automatically.
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[2]?.power).toBe(6000);
    e.playCard("ST01-015", "north");
    e.asNorth().chooseTargets(target);
    expect(e.getView("south").players.south.trash[0]?.instanceId).toBe(target);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
});
