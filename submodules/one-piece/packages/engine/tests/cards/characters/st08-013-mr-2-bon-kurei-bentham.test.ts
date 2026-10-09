import { describe, expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST08-013 Mr.2.Bon.Kurei(Bentham)", () => {
  test("losing an attacking battle KOs only the battled Character, then itself", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "OP01-120", rested: true }, "ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "OP01-120");
    e.declareAttack(source, target, "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines the optional KO without removing either Character", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "OP01-120", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    e.declareAttack(source, e.findCardInZone("north", "character", "OP01-120"), "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === source)).toBe(
      true,
    );
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("survives defending and KOs the attacking Character", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, rested: true }] },
      { character: [{ cardId: "ST02-012", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.declareAttack(target, source, "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: a defending Bon Kurei already KO'd cannot activate", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, rested: true }] },
      { character: [{ cardId: "OP01-120", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "OP01-120");
    e.declareAttack(target, source, "north");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(e.getView("south").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("requires DON and an opposing Character battle", () => {
    for (const leaderTarget of [false, true]) {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "ST08-013", attachedDon: leaderTarget ? 1 : 0, playedOnTurn: 0 }] },
        { character: [{ cardId: "OP01-120", rested: true }] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const source = e.findCardInZone("south", "character", "ST08-013");
      e.declareAttack(
        source,
        leaderTarget ? e.leader("north") : e.findCardInZone("north", "character", "OP01-120"),
        "south",
      );
      expect(
        e.getView("south").players.south.characters.some((c) => c?.instanceId === source),
      ).toBe(true);
      expect(e.getView("south").players.north.trash).toHaveLength(0);
      expect(e.getView("south").prompts).toHaveLength(0);
    }
  });
  test("does not KO itself when the opponent was already KO'd in battle", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "ST02-006", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "ST02-006");
    e.declareAttack(source, target, "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === source)).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("effect KO immunity prevents both KOs", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "ST06-004", rested: true }], hand: ["ST02-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "ST06-004");
    e.declareAttack(source, target, "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST02-012")] },
      "north",
    );
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === source)).toBe(
      true,
    );
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test.each([true, false])(
    "replacement accepted=%s preserves success-dependent self KO across a Life choice",
    (accept) => {
      let e = OnePieceTestEngine.create(
        { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
        {
          character: [{ cardId: "ST09-010", rested: true }],
          hand: ["ST02-012"],
          life: ["ST02-006", "ST02-012"],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const source = e.findCardInZone("south", "character", "ST08-013");
      const target = e.findCardInZone("north", "character", "ST09-010");
      e.declareAttack(source, target, "south");
      e.resolveDecision(
        "battleCounter",
        { selectedIds: [e.findCardInZone("north", "hand", "ST02-012")] },
        "north",
      );
      e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      e.resolveDecision("effectKoReplacement", { optionId: accept ? "yes" : "no" }, "north");
      if (accept) {
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "north");
      }
      expect(
        e.getView("south").players.south.characters.some((c) => c?.instanceId === source),
      ).toBe(accept);
      expect(
        e.getView("south").players.north.characters.some((c) => c?.instanceId === target),
      ).toBe(accept);
      expect(e.getView("south").players.north.lifeCount).toBe(accept ? 1 : 2);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("does not affect Marco's new object after battle KO and replay", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ cardId: "OP02-018", rested: true }], hand: ["EB01-005"], life: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "OP02-018");
    e.declareAttack(source, target, "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === source)).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("does not activate when the blocking opponent leaves before comparison", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
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
    const source = e.findCardInZone("south", "character", "ST08-013");
    const target = e.findCardInZone("north", "character", "OP01-014");
    e.declareAttack(source, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [target] }, "north");
    e.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [e.findCardInZone("north", "hand", "ST01-007")] },
      "north",
    );
    e.resolveDecision("effectPlayCharacterReplacement", { selectedIds: [target] }, "north");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === source)).toBe(
      true,
    );
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("synthetic successful self-KO keeps a non-self draw follow-up", () => {
    // Engine boundary fixture, not additional printed Bon Kurei text.
    const card = getCard("ST08-013");
    const original = card.effects;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "ko",
                target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
                thenActions: [{ action: "draw", player: "self", amount: 1 }],
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create({
        character: ["ST08-013"],
        deck: ["ST02-006", "ST02-012"],
      });
      const source = e.findCardInZone("south", "character", "ST08-013");
      e.activateEffect(source, "activateMain", "south");
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
      expect(e.getView("south").players.south.hand).toHaveLength(1);
      expect(e.getView("south").prompts).toHaveLength(0);
    } finally {
      card.effects = original;
    }
  });
});
