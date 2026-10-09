import type { Target } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function ownCharacter(name: string): Target {
  return {
    player: "self",
    zones: ["character"],
    count: { amount: 1 },
    filters: [{ filter: "name", value: name }],
  };
}

function syntheticCards(run: (cards: ReturnType<typeof getCard>[]) => void) {
  const cards = ["EB01-005", "ST01-005", "EB01-018", "EB01-023"].map(getCard);
  const originals = cards.map((card) => card.effects);
  try {
    run(cards);
  } finally {
    cards.forEach((card, index) => {
      card.effects = originals[index];
    });
  }
}

function chooseSource(engine: OnePieceTestEngine, name: string, seat: "south" | "north" = "south") {
  const step = engine.pendingDecision("readyEffectOrder", seat).steps[0];
  if (step.kind !== "chooseOption") throw new Error("Expected effect-order choice.");
  const option = step.options.find((candidate) => candidate.label.includes(name));
  if (!option) throw new Error(`Missing ${name} effect.`);
  engine.resolveDecision("readyEffectOrder", { optionId: option.id }, seat);
}

describe("Comprehensive Rules 8-6 ready auto effects", () => {
  test("a pending optional cost can become payable after another ready effect", () =>
    syntheticCards(([a, b]) => {
      a.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "draw", player: "self", amount: 1 }] },
        ],
      };
      b.effects = {
        effects: [
          {
            trigger: "onYourAttack",
            optional: true,
            costs: [{ cost: "trashFromHand", amount: 1 }],
            actions: [{ action: "draw", player: "self", amount: 2 }],
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [a, b] },
        { leaderCardId: "ST01-001" },
      );
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      engine.accept("south");
      expect(engine.getView("south").players.south.handCount).toBe(2);
    }));

  test("Life Trigger interrupts effect damage before later actions and ready siblings", () =>
    syntheticCards(([a, b, , life]) => {
      a.effects = {
        effects: [
          {
            trigger: "onYourAttack",
            actions: [
              { action: "dealDamage", player: "opponent", amount: 1 },
              { action: "draw", player: "self", amount: 1 },
            ],
          },
        ],
      };
      b.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "draw", player: "self", amount: 2 }] },
        ],
      };
      life.effects = {
        effects: [{ trigger: "trigger", actions: [{ action: "draw", player: "self", amount: 1 }] }],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [a, b] },
        { leaderCardId: "ST01-001", life: [life] },
      );
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      chooseSource(engine, a.name);
      expect(engine.getView("south").players.south.handCount).toBe(0);
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      expect(engine.getView("south").players.south.handCount).toBe(3);
      expect(engine.getView("south").players.north.handCount).toBe(1);
      expect(
        engine
          .getView("south")
          .logs.filter((log) => log.message.includes("resolves its"))
          .map((log) => log.sourceCardId),
      ).toEqual([a.id, life.id, b.id]);
    }));

  test("DON condition must hold when the effect triggers", () =>
    syntheticCards(([a, b]) => {
      a.effects = {
        effects: [
          {
            trigger: "onYourAttack",
            actions: [
              {
                action: "giveDon",
                target: ownCharacter(b.name),
                count: { amount: 1 },
                donState: "active",
              },
            ],
          },
        ],
      };
      b.effects = {
        effects: [
          {
            trigger: "onYourAttack",
            conditions: [{ condition: "donAttached", amount: 1 }],
            actions: [{ action: "draw", player: "self", amount: 2 }],
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [a, b], activeDon: 1 },
        { leaderCardId: "ST01-001" },
      );
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      expect(engine.getView("south").players.south.handCount).toBe(0);
      expect(
        engine.getView("south").players.south.characters.find((card) => card?.cardId === b.id)
          ?.attachedDon,
      ).toBe(1);
    }));

  test("battle damage offers Life Trigger before damage auto effects", () =>
    syntheticCards(([a, , , life]) => {
      a.effects = {
        effects: [
          { trigger: "whenDealsDamage", actions: [{ action: "draw", player: "self", amount: 1 }] },
        ],
      };
      life.effects = {
        effects: [{ trigger: "trigger", actions: [{ action: "draw", player: "self", amount: 1 }] }],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [{ card: a, attachedDon: 3 }] },
        { leaderCardId: "ST01-001", life: [life] },
      );
      engine.asSouth().attack(a, engine.leader("north"));
      engine.pendingDecision("lifeTrigger", "north");
      expect(engine.getView("south").players.south.handCount).toBe(0);
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      expect(engine.getView("south").players.south.handCount).toBe(1);
      expect(engine.getView("south").players.north.handCount).toBe(1);
    }));

  test("original active and opponent effects resolve before newly triggered effects", () =>
    syntheticCards(([a, b, c, opponent]) => {
      a.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "rest", target: ownCharacter(c.name) }] },
        ],
      };
      b.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "draw", player: "self", amount: 1 }] },
        ],
      };
      c.effects = {
        effects: [
          {
            trigger: "whenBecomesRested",
            eventFilter: { targetSelf: true },
            actions: [{ action: "draw", player: "self", amount: 1 }],
          },
        ],
      };
      opponent.effects = {
        effects: [
          { trigger: "onOpponentAttack", actions: [{ action: "draw", player: "self", amount: 1 }] },
        ],
      };
      let engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [a, b, c] },
        { leaderCardId: "ST01-001", character: [opponent], deck: Array(30).fill("ST02-002") },
      );
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      chooseSource(engine, a.name);
      expect(
        engine
          .getView("south")
          .logs.filter((log) => log.message.includes("resolves its"))
          .map((log) => log.sourceCardId),
      ).toEqual([a.id, b.id, opponent.id, c.id]);
      expect(engine.getView("south").players.south.handCount).toBe(2);
      expect(engine.getView("south").players.north.handCount).toBe(1);
    }));

  test("two auto blocks on one source can be chosen in either order", () =>
    syntheticCards(([source]) => {
      source.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "draw", player: "self", amount: 1 }] },
          {
            trigger: "onYourAttack",
            actions: [{ action: "trashFromHand", player: "self", amount: 1 }],
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [source] },
        { leaderCardId: "ST01-001" },
      );
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      const step = engine.pendingDecision("readyEffectOrder", "south").steps[0];
      if (step.kind !== "chooseOption") throw new Error("Expected two block choices.");
      expect(step.options.map((option) => option.label)).toEqual(
        expect.arrayContaining([
          expect.stringContaining("effect 1"),
          expect.stringContaining("effect 2"),
        ]),
      );
      const second = step.options.find((option) => option.label.endsWith("effect 2"))!;
      engine.resolveDecision("readyEffectOrder", { optionId: second.id }, "south");
      expect(engine.getView("south").players.south.handCount).toBe(1);
    }));

  test("a source that leaves and reenters loses its previously ready effect", () =>
    syntheticCards(([a, b]) => {
      a.effects = {
        effects: [
          {
            trigger: "onYourAttack",
            actions: [
              { action: "returnToHand", target: ownCharacter(b.name) },
              {
                action: "play",
                source: { player: "self", zone: "hand" },
                count: { amount: 1 },
                filters: [{ filter: "name", value: b.name }],
              },
            ],
          },
        ],
      };
      b.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "draw", player: "self", amount: 2 }] },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [a, b] },
        { leaderCardId: "ST01-001" },
      );
      const bId = engine.findCardInZone("south", "character", b);
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      chooseSource(engine, a.name);
      expect(
        engine.getView("south").players.south.characters.some((card) => card?.instanceId === bId),
      ).toBe(true);
      expect(engine.getView("south").players.south.handCount).toBe(0);
      expect(
        engine
          .getView("south")
          .logs.filter((log) => log.message.includes("resolves its"))
          .map((log) => log.sourceCardId),
      ).toEqual([a.id]);
    }));

  test("chosen payment and all actions finish before another ready block", () =>
    syntheticCards(([a, b, c]) => {
      a.effects = {
        effects: [
          {
            trigger: "onYourAttack",
            costs: [{ cost: "restCards", amount: 1 }],
            actions: [
              { action: "draw", player: "self", amount: 1 },
              { action: "rest", target: ownCharacter(c.name) },
              { action: "draw", player: "self", amount: 1 },
            ],
          },
        ],
      };
      b.effects = {
        effects: [
          { trigger: "onYourAttack", actions: [{ action: "draw", player: "self", amount: 1 }] },
        ],
      };
      c.effects = {
        effects: [
          {
            trigger: "whenBecomesRested",
            eventFilter: { targetSelf: true },
            actions: [{ action: "trashFromHand", player: "self", amount: 2 }],
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: [a, b, c] },
        { leaderCardId: "ST01-001" },
      );
      engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
      chooseSource(engine, a.name);
      expect(engine.getView("south").players.south.handCount).toBe(0);
      engine.resolveDecision(
        "effectCostRestCards",
        { selectedIds: [engine.findCardInZone("south", "character", a)] },
        "south",
      );
      const hand = engine.getView("south").players.south.hand;
      expect(hand).toHaveLength(3);
      engine.resolveDecision(
        "effectTrashFromHandSelection",
        { selectedIds: hand.slice(0, 2).map((card) => card.instanceId!) },
        "south",
      );
      expect(engine.getView("south").players.south.handCount).toBe(1);
      expect(
        engine
          .getView("south")
          .logs.filter((log) => log.message.includes("resolves its"))
          .map((log) => log.sourceCardId),
      ).toEqual([a.id, b.id, c.id]);
    }));
});
