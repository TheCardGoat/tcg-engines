import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("Zoro keeps the optional discard after the rest in one On Play sequence", () => {
  const effects = buildCardEffects(
    "[On Play] Rest up to 1 of your opponent's cards. Then, you may trash 1 card from your hand. If you do, give up to 3 rested DON!! cards to your Leader.",
  );
  expect(effects?.effects).toHaveLength(1);
  expect(effects?.effects?.[0]?.actions).toEqual([
    expect.objectContaining({ action: "rest" }),
    {
      action: "optional",
      actions: [
        expect.objectContaining({
          action: "trashFromHand",
          amount: 1,
          thenRequiresFullAmount: true,
          thenActions: [
            expect.objectContaining({ action: "giveDon", count: { amount: 3, upTo: true } }),
          ],
        }),
      ],
    },
  ]);
});
