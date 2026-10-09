import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-010 Zephyr", () => {
  test("gains 3000 after attacking a Strike Character, then expires at turn end", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST05-010", playedOnTurn: 0 }] },
      { character: [{ cardId: "ST02-006", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST05-010");
    e.declareAttack(id, e.findCardInZone("north", "character", "ST02-006"), "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(11000);
    e.endTurn("south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(8000);
  });
  test("two defending battles against Strike Characters give cumulative 6000", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST05-010", rested: true }] },
      {
        character: [
          { cardId: "ST02-006", playedOnTurn: 0 },
          { cardId: "ST02-006", playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "ST05-010");
    const attackers = e
      .getView("north")
      .players.north.characters.filter((c) => c !== null)
      .map((c) => c.instanceId);
    e.declareAttack(attackers[0]!, id, "north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(11000);
    e.declareAttack(attackers[1]!, id, "north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(14000);
  });
  test.each(["character", "leader"])(
    "does not gain power against non-Strike Character or Strike Leader: %s",
    (target) => {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "ST05-010", playedOnTurn: 0 }] },
        { leaderCardId: "ST01-001", character: [{ cardId: "ST02-002", rested: true }] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const id = e.findCardInZone("south", "character", "ST05-010");
      e.declareAttack(
        id,
        target === "leader"
          ? e.leader("north")
          : e.findCardInZone("north", "character", "ST02-002"),
        "south",
      );
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
      ).toBe(8000);
    },
  );
  test("declining DON payment preserves use, accepting grants 2000 only once", () => {
    const e = OnePieceTestEngine.create({ character: ["ST05-010"], activeDon: 2 });
    const id = e.findCardInZone("south", "character", "ST05-010");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(2);
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(10000);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: id,
      trigger: "activateMain",
    });
    e.endTurn("south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(8000);
  });
  test("does not gain power when its Strike blocker leaves before comparison", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST05-010", playedOnTurn: 0 }] },
      {
        character: [
          { cardId: "OP01-014", attachedDon: 1 },
          "ST02-006",
          "ST02-006",
          "ST02-006",
          "ST02-006",
        ],
        hand: ["ST01-007"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST05-010");
    const jinbe = e.findCardInZone("north", "character", "OP01-014");
    const nami = e.findCardInZone("north", "hand", "ST01-007");
    e.declareAttack(id, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [jinbe] }, "north");
    e.resolveDecision("effectPlaySelection", { selectedIds: [nami] }, "north");
    e.resolveDecision("effectPlayCharacterReplacement", { selectedIds: [jinbe] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(jinbe);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(8000);
  });
});
