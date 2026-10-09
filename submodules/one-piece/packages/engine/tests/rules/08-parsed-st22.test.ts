import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function parsed(id: string, run: () => void) {
  const card = getCard(id);
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    run();
  } finally {
    card.effects = original;
  }
}

test.each([false, true])(
  "parsed Ace & Newgate returns the revealed card after drawing, multiple=%s",
  (multiple) =>
    parsed("ST22-001", () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST22-001",
        hand: multiple ? ["OP01-033", "ST15-001"] : ["OP01-033"],
        deck: ["ST02-002", "ST02-006", "ST02-012"],
      });
      const revealed = e.findCardInZone("south", "hand", "OP01-033");
      const drawn = e.findCardInZone("south", "deck", "ST02-002");
      e.asSouth().activateMain(e.leader("south"));
      e.asSouth().acceptOptional();
      if (multiple)
        e.resolveDecision("effectCostRevealFromHand", { selectedIds: [revealed] }, "south");
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
      expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(revealed);
      expect(e.getView("south").prompts).toHaveLength(0);
    }),
);

test.each([0, 1])(
  "parsed Whitebeard Event preserves optional Life choice %s after skipped play",
  (count) =>
    parsed("ST22-015", () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST22-001",
        hand: ["ST22-015", "OP02-004"],
        activeDon: 8,
        life: ["ST02-002", "ST02-006"],
      });
      const paid = e.findCardInZone("south", "life", "ST02-006");
      e.playCard("ST22-015");
      e.asSouth().choosePlay();
      e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");
      e.resolveDecision("effectRemoveFromLifeCount", { optionId: String(count) }, "south");
      if (count === 1) e.asSouth().chooseTargets(e.leader("south"));
      expect(e.getView("south").players.south.leader.power).toBe(count === 1 ? 7000 : 5000);
      expect(e.getView("south").players.south.hand.some((c) => c.instanceId === paid)).toBe(
        count === 1,
      );
      expect(e.getView("south").players.south.lifeCount).toBe(2 - count);
      expect(e.getView("south").prompts).toHaveLength(0);
    }),
);
