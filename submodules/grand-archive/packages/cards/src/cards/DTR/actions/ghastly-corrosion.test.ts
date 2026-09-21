import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { ghastlyCorrosion } from "./ghastly-corrosion.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { combustiblePotion } from "../../RDO/items/combustible-potion.ts";
import { tomeOfIgnorance } from "../items/tome-of-ignorance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { ephemeralDiscountFixture } from "../../../testing/ephemeral-discount.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 40xhntos3d-a1 */
describe("Ghastly Corrosion — capped ephemeral discount", () => {
  for (const count of [0, 1, 2, 3])
    it(`requires ${4 - Math.min(2, count)} reserve with ${count} own ephemeral objects`, () => {
      const { game, p, q, payment } = ephemeralDiscountFixture(ghastlyCorrosion, count);
      const target = q.card(trainingSword),
        cost = 4 - Math.min(2, count);
      const targets = { "target-1": [target.objectId] },
        before = game.state;
      expect(() =>
        p.activate(ghastlyCorrosion, { targets, reservePayment: payment(cost - 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(ghastlyCorrosion, { targets, reservePayment: payment(cost) });
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
    });
});

/** @covers 40xhntos3d-a2 */
describe("Ghastly Corrosion — item and weapon cost limits", () => {
  for (const own of [false, true])
    for (const card of [trainingSword, combustiblePotion])
      it(`destroys ${own ? "own" : "opposing"} ${card.slug} and rejects ineligible targets`, () => {
        const champion = createClassBonusTestChampion(
          ghastlyCorrosion,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [ghastlyCorrosion, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              field: [trainingSword, combustiblePotion],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trainingSword, combustiblePotion, tomeOfIgnorance, woodlandSquirrels],
              graveyard: [combustiblePotion],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const reservePayment = p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [
          q.card(tomeOfIgnorance),
          q.card(woodlandSquirrels),
          q.card(combustiblePotion, { zone: "graveyard" }),
          q.card(champion),
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(ghastlyCorrosion, {
              targets: { "target-1": [invalid.objectId] },
              reservePayment,
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const target = (own ? p : q).card(card, { zone: "field" });
        p.activate(ghastlyCorrosion, {
          targets: { "target-1": [target.objectId] },
          reservePayment,
        });
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          card === trainingSword ? "banishment" : "graveyard",
        );
        expect(game.state.objects[(own ? q : p).card(card, { zone: "field" }).objectId]!.zone).toBe(
          "field",
        );
      });
});
