import { describe, expect, it } from "vitest";
import { spectralDiffusion } from "./spectral-diffusion.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { ephemeralDiscountFixture } from "../../../testing/ephemeral-discount.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers lathqgiqgi-a1 */
describe("Spectral Diffusion — capped discount", () => {
  for (const count of [0, 1, 2, 3])
    it(`pays ${4 - Math.min(2, count)} with ${count} controlled ephemeral objects`, () => {
      const { game, p, payment } = ephemeralDiscountFixture(spectralDiffusion, count);
      const cost = 4 - Math.min(2, count),
        before = game.state;
      expect(() => p.activate(spectralDiffusion, { reservePayment: payment(cost - 1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(spectralDiffusion, { reservePayment: payment(cost) });
      passEffectsStack(game);
      expect(game.state.objects[p.card(spectralDiffusion).objectId]!.zone).toBe("graveyard");
    });
});

/** @covers lathqgiqgi-a2 */
it("protects its champion and current controlled ephemeral objects from spells for this turn", () => {
  const { game, p, q, champion, payment, own, opposing } = ephemeralDiscountFixture(
    spectralDiffusion,
    1,
  );
  p.activate(spectralDiffusion, { reservePayment: payment(3) });
  passEffectsStack(game);
  for (const target of [p.card(champion), own[0]!]) {
    const before = game.state;
    expect(() =>
      p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
        targets: { "target-1": [target.objectId] },
        reservePayment: payment(4),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  }
  const later = p.card(evercurrentRaider, { zone: "graveyard" });
  p.activate(later, { activationMethod: "ephemerate", reservePayment: payment(2) });
  passEffectsStack(game);
  for (const target of [p.card(giantTortoise), opposing, later]) {
    p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
      targets: { "target-1": [target.objectId] },
      reservePayment: payment(4),
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
  }
  advanceToMain(game, q.id);
  advanceToMain(game, p.id);
  p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
    targets: { "target-1": [p.card(champion).objectId] },
    reservePayment: payment(4),
  });
  passEffectsStack(game);
  expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
});
