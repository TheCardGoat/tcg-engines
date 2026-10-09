import { describe } from "vitest";
import { glassgaleFlock } from "./glassgale-flock.ts";
import { memoriteShardwing } from "../../PTM/tokens/memorite-shardwing.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers KRNYwHCOVM-a1 */
describe("glassgaleFlock", () => {
  proveSummonOnEnter({
    card: glassgaleFlock,
    token: memoriteShardwing,
    cost: 3,
    count: 1,
    abilityId: "KRNYwHCOVM-a1",
  });
});

import { expect, it } from "vitest";
import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { spallingCleanse } from "../../SP4/actions/spalling-cleanse.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers KRNYwHCOVM-a2 */
describe("Glassgale Flock — conditional replacement summon", () => {
  for (const sheen of [0, 4, 6])
    for (const existing of [false, true])
      it(`checks earned sheen and the existing ally: sheen=${sheen}, existing=${existing}`, () => {
        const { game, p, pay } = fracturedMemoriesFixture(
          [glassgaleFlock, fireball, ...Array.from({ length: sheen / 2 }, () => spallingCleanse)],
          [memoriteShardwing],
        );
        for (const cleanse of p.cards(spallingCleanse, { zone: "hand" })) {
          p.activate(cleanse, { reservePayment: pay(2) });
          passEffectsStack(game);
        }
        p.activate(glassgaleFlock, { reservePayment: pay(3) });
        passEffectsStack(game);
        expect(p.cards(memoriteShardwing, { zone: "field" })).toHaveLength(1);
        if (!existing) {
          p.activate(fireball, {
            reservePayment: pay(4),
            targets: { "target-1": [p.card(memoriteShardwing).objectId] },
          });
          passEffectsStack(game);
          expect(p.cards(memoriteShardwing, { zone: "field" })).toHaveLength(0);
        }
        const source = p.card(glassgaleFlock),
          before = game.state;
        if (sheen < 6) {
          expect(() =>
            p.activateAbility(source, "KRNYwHCOVM-a2", { reservePayment: pay(2) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        expect(() =>
          p.activateAbility(source, "KRNYwHCOVM-a2", { reservePayment: pay(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "KRNYwHCOVM-a2", { reservePayment: pay(2) });
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(p.cards(memoriteShardwing, { zone: "field" })).toHaveLength(existing ? 1 : 0);
        passEffectsStack(game);
        expect(p.cards(memoriteShardwing, { zone: "field" })).toHaveLength(1);
        expect(() =>
          p.activateAbility(source, "KRNYwHCOVM-a2", { reservePayment: pay(2) }),
        ).toThrow();
      });
});
