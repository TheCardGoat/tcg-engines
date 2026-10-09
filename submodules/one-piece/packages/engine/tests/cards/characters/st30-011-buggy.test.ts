import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-011-buggy", () => {
  test("active Buggy rests to protect base6000 from opponent KO", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-011", "ST30-007"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST01-015", "north");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST30-007"));
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.characters[1]?.cardId).toBe("ST30-007");
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
  test("rested Buggy cannot pay replacement rest", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST30-011", rested: true }, "ST30-007"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST01-015", "north");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST30-007"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-007");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines optional removal protection with active Buggy", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-011", "ST30-007"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST01-015", "north");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST30-007"));
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-007");
  });
  test("actual Blocker intercept prevents Leader damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-011"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST30-011"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-011");
  });
  test("rests to replace an opponent bottom-deck removal", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-011", "ST30-007"] },
      { hand: ["OP04-056"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target = e.findCardInZone("south", "character", "ST30-007");
    e.playCard("OP04-056", "north");
    e.asNorth().chooseTargets(target);
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.characters[1]?.instanceId).toBe(target);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
  test("own effect KO cannot be replaced by resting Buggy", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-091",
        hand: ["OP01-094"],
        activeDon: 10,
        character: ["ST30-007", "ST30-011"],
      },
      {},
    );
    e.playCard("OP01-094");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      "ST30-007",
      "ST30-011",
    ]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("battle KO of the protected-size Character does not offer replacement", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-011", { cardId: "ST30-007", rested: true }] },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST15-002"),
      e.findCardInZone("south", "character", "ST30-007"),
    );
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-007");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
