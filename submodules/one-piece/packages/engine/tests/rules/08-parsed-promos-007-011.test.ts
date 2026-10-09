import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
function parsed(id: string, run: () => void) {
  const card = getCard(id),
    old = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    run();
  } finally {
    card.effects = old;
  }
}

test.each([
  ["OP13-001", true],
  ["OP01-001", false],
] as const)(
  "generated Luffy battle immunity checks attacking Leader attribute %s",
  (leader, saved) =>
    parsed("P-007", () => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: leader },
        { character: [{ cardId: "P-007", rested: true, attachedDon: 1 }] },
      );
      const target = e.findCardInZone("north", "character", "P-007");
      e.asSouth().attack(e.leader("south"), target);
      expect(
        e.getView("north").players.north.characters.some((c) => c?.instanceId === target),
      ).toBe(saved);
    }),
);
test.each([5, 6])("generated Law gates opposing top Life movement at hand %s", (hand) =>
  parsed("P-009", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-009"], activeDon: 6 },
      { hand, life: ["ST29-012", "ST02-002"] },
    );
    const top = e.findCardInZone("north", "life", "ST29-012");
    e.asSouth().play("P-009");
    expect(e.getView("north").players.north.hand.some((c) => c.instanceId === top)).toBe(
      hand === 6,
    );
    expect(e.getView("north").players.north.lifeCount).toBe(hand === 6 ? 1 : 2);
    expect(e.getView("north").prompts).toHaveLength(0);
  }),
);
test.each([true, false])("generated Uta optional DON payment accepted=%s", (accept) =>
  parsed("P-011", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-011",
      character: ["P-012", "P-018"],
      activeDon: 2,
    });
    e.asSouth().activateMain(e.leader("south"));
    if (accept) {
      e.asSouth().acceptOptional();
      e.asSouth().chooseTargets("P-012");
    } else e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(accept ? 1 : 2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(accept ? 7000 : 5000);
  }),
);
