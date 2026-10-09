import { describe, expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST22-015 I Am Whitebeard!!", () => {
  test.each(["top", "bottom"] as const)(
    "skips the legal Newgate play then adds %s Life and gains power through opponent turn",
    (position) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST22-001",
        hand: ["ST22-015", "OP02-004"],
        activeDon: 8,
        life: ["ST02-002", "ST02-006"],
      });
      const life = e.findCardInZone("south", "life", position === "top" ? "ST02-002" : "ST02-006");
      e.playCard("ST22-015");
      e.asSouth().choosePlay();
      e.resolveDecision("effectLifePosition", { optionId: position }, "south");
      e.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
      e.asSouth().chooseTargets(e.leader("south"));
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(life);
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
      expect(e.getView("south").players.south.leader.power).toBe(7000);
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(7000);
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(5000);
    },
  );

  test("plays Newgate and explicitly declines optional Life payment without a power bonus", () => {
    for (const position of ["top", "bottom"] as const) {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST22-001",
        hand: ["ST22-015", "OP02-004"],
        activeDon: 8,
        life: 2,
        deck: ["ST02-002", "ST02-006", "ST02-012"],
      });
      const newgate = e.findCardInZone("south", "hand", "OP02-004");
      e.playCard("ST22-015");
      e.asSouth().choosePlay(newgate);
      e.resolveDecision("effectLifePosition", { optionId: position }, "south");
      e.resolveDecision("effectRemoveFromLifeCount", { optionId: "0" }, "south");
      e.asSouth().chooseTargets();
      expect(
        e.getView("south").players.south.characters.some((c) => c?.instanceId === newgate),
      ).toBe(true);
      expect(e.getView("south").players.south.lifeCount).toBe(2);
      expect(e.getView("south").players.south.leader.power).toBe(5000);
      expect(e.getView("south").prompts).toHaveLength(0);
    }
  });

  test("Life payment resolves after playing Newgate and before its On Play prohibition", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["ST22-015", "OP02-004"],
      activeDon: 8,
      life: ["ST02-002", "ST02-006"],
    });
    const paid = e.findCardInZone("south", "life", "ST02-006");
    e.playCard("ST22-015");
    e.asSouth().choosePlay(e.findCardInZone("south", "hand", "OP02-004"));
    e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");
    e.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    e.asSouth().chooseTargets(e.leader("south"));
    e.asSouth().chooseTargets(); // Decline Newgate's separate On Play power gain.
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("zero Life cannot grant the power bonus after Newgate is played", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["ST22-015", "OP02-004"],
      activeDon: 8,
      life: 0,
      deck: ["ST02-002", "ST02-006"],
    });
    e.playCard("ST22-015");
    e.asSouth().choosePlay(e.findCardInZone("south", "hand", "OP02-004"));
    const p = e.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    if (p?.kind !== "chooseOption") throw Error("Life count");
    expect(p.options.map((o) => o.id)).toEqual(["0"]);
    e.resolveDecision("effectRemoveFromLifeCount", { optionId: "0" }, "south");
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("unrelated Leader pays the Event but cannot play Newgate or take Life", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      hand: ["ST22-015", "OP02-004"],
      activeDon: 8,
      life: 2,
    });
    e.playCard("ST22-015");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("OP02-004");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("a replaced Life-to-hand move does not satisfy If you do", () => {
    // Synthetic coexistence: Luffy has no printed Whitebeard trait. Extend
    // only that gate to test the independent movement-completion rule.
    const luffy = getCard("ST13-003");
    const original = luffy.traits;
    try {
      luffy.traits = [...(original ?? []), "Whitebeard Pirates"];
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST13-003",
        hand: ["ST22-015"],
        activeDon: 8,
        life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }],
      });
      const paid = e.findCardInZone("south", "life", "ST02-002");
      e.playCard("ST22-015");
      e.resolveDecision("effectLifePosition", { optionId: "top" }, "south");
      e.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
      expect(e.getState().players.south.deck.at(-1)).toBe(paid);
      expect(e.getView("south").players.south.handCount).toBe(0);
      expect(e.getView("south").players.south.leader.power).toBe(5000);
      expect(e.getView("south").prompts).toHaveLength(0);
    } finally {
      luffy.traits = original;
    }
  });
});
