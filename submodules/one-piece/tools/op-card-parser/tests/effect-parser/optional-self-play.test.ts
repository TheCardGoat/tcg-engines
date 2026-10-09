import { getCard } from "../../../../packages/cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../../packages/engine/src/index.ts";
import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("optional self replay after payment", () => {
  test.each([true, false])(
    "preserves independent replay choice only when printed: %s",
    (optional) => {
      const parsed = buildCardEffects(
        `[On K.O.] You may trash 1 Event from your hand: ${optional ? "You may play" : "Play"} this Character card from your trash rested.`,
      );
      expect(parsed?.effects?.[0]).toMatchObject({
        trigger: "onKo",
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [{ filter: "cardCategory", value: "event" }],
          },
        ],
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            self: true,
            count: { amount: 1 },
            playState: "rested",
          },
        ],
      });
      const action = parsed?.effects?.[0]?.actions[0];
      if (action?.action !== "play") throw new Error("Expected self replay.");
      expect(action.count.upTo ?? false).toBe(optional);
    },
  );
});

test("parsed Curiel retains the independent restriction through public attacks", () => {
  const card = getCard("OP03-004");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create(
      { hand: ["OP03-004"], activeDon: 4 },
      { character: [{ cardId: "EB01-005", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard("OP03-004");
    const attackerId = engine.findCardInZone("south", "character", "OP03-004");
    const targetId = engine.findCardInZone("north", "character", "EB01-005");
    engine.expectFailure({ type: "declareAttack", seat: "south", attackerId, targetId });
    engine.attachDon(attackerId, 1);
    engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId,
      targetId: engine.leader("north"),
    });
    engine.declareAttack(attackerId, targetId);
    expect(engine.getView("south").players.north.trash.map((entry) => entry.instanceId)).toContain(
      targetId,
    );
  } finally {
    card.effects = original;
  }
});

test("parsed Marco permits paying the Event but declining replay", () => {
  const card = getCard("OP03-013");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create(
      { character: ["EB01-018"] },
      { character: [{ cardId: "OP03-013", rested: true }], hand: ["OP02-021"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const marcoId = engine.findCardInZone("north", "character", "OP03-013");
    engine.declareAttack(engine.findCardInZone("south", "character", "EB01-018"), marcoId);
    engine.accept("north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");
    const view = engine.getView("north").players.north;
    expect(view.trash.map((entry) => entry.cardId)).toEqual(
      expect.arrayContaining(["OP03-013", "OP02-021"]),
    );
    expect(view.hand).toHaveLength(0);
    expect(view.characters.filter(Boolean)).toHaveLength(0);
  } finally {
    card.effects = original;
  }
});
