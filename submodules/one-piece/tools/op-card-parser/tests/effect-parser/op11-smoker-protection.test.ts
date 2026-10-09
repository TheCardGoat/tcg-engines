import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("Smoker's DON-gated non-Special protection applies only to Character effects", () => {
  expect(
    buildCardEffects(
      "[DON!! x1] This Character cannot be K.O.'d by effects of Characters without the <Special> attribute.",
    )?.permanentEffects?.[0],
  ).toMatchObject({
    conditions: [{ condition: "donAttached", amount: 1 }],
    actions: [
      {
        action: "cannotBeKod",
        restriction: "byEffect",
        byFilter: [
          { filter: "cardCategory", value: "character" },
          { filter: "attribute", value: "special", negate: true },
        ],
      },
    ],
  });
});

test("Camie permits activation before testing Life for its paired result", () => {
  const effects = buildCardEffects(
    "[Your Turn] [Once Per Turn] This effect can be activated when your opponent activates an Event or [Trigger]. If your opponent has 2 or more Life cards, trash 1 card from the top of each of your and your opponent's Life cards.",
  )?.effects;
  expect(effects).toHaveLength(2);
  for (const block of effects ?? []) {
    expect(block.conditions).toEqual([{ condition: "turn", value: "your" }]);
    expect(block.optional).toBe(true);
    expect(block.oncePerTurnKey).toBe("opponentEventOrTrigger");
    expect(block.actions).toMatchObject([
      {
        action: "sequence",
        condition: { condition: "lifeCount", player: "opponent", comparison: "gte", value: 2 },
        actions: [
          { action: "removeFromLife", player: "self" },
          { action: "removeFromLife", player: "opponent" },
        ],
      },
    ]);
  }
});
