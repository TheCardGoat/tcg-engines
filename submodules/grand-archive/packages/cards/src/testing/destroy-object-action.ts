import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { fluteOfTaming } from "../cards/DOA/items/flute-of-taming.ts";
import { sealedBladeDoa } from "../cards/DOA/weapons/sealed-blade-doa.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveDestroyObjectAction({
  card,
  cost,
  cheapRegalia,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  cheapRegalia: boolean;
}): void {
  for (const targetCard of cheapRegalia
    ? [trainingSword, fluteOfTaming]
    : [trainingSword, fluteOfTaming, woodlandSquirrels, sealedBladeDoa])
    for (const self of [false, true])
      it(`destroys ${self ? "own" : "opposing"} ${targetCard.slug}`, () => {
        const champion = createClassBonusTestChampion(card, false, "activation-discount"),
          field = [trainingSword, fluteOfTaming, woodlandSquirrels, sealedBladeDoa];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field,
            },
          },
          playerTwo: { champion, zones: { field } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = (self ? p : q).card(targetCard, { zone: "field" }),
          other = (self ? q : p).card(targetCard, { zone: "field" }),
          payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const illegal of [
          p.card(champion),
          ...(cheapRegalia
            ? [q.card(sealedBladeDoa), q.card(woodlandSquirrels, { zone: "field" })]
            : []),
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(card, {
              reservePayment: payment,
              targets: { "target-1": [illegal.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const before = game.state;
        expect(() =>
          p.activate(card, {
            reservePayment: payment.slice(1),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(card, { reservePayment: payment, targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          targetCard === woodlandSquirrels ? "graveyard" : "banishment",
        );
        expect(game.state.objects[other.objectId]!.zone).toBe("field");
      });
}
