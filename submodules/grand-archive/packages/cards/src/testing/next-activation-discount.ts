import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { rebelliousBull } from "../cards/DOA/allies/rebellious-bull.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveNextActivationDiscount({
  card,
  abilityId,
  amount,
  beastOnly,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  amount: number;
  beastOnly: boolean;
}): void {
  for (const classBonus of [false, true])
    for (const expire of [false, true])
      for (const cheap of [false, true])
        it(`class=${classBonus}, expired=${expire}, cost=${cheap ? 2 : 5}`, () => {
          const champion = grantTestChampionLevel(
              createClassBonusTestChampion(card, classBonus, "activation-discount"),
              2,
            ),
            ally = cheap ? grayWolf : rebelliousBull;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [card],
                hand: [ally, ally, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            initial = p.zone("hand").length;
          p.activateAbility(card, abilityId);
          expect(p.cards(card, { zone: "banishment" })).toHaveLength(1);
          passEffectsStack(game);
          expect(p.zone("hand")).toHaveLength(initial + Number(beastOnly && classBonus));
          if (beastOnly) {
            p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
            passEffectsStack(game);
          }
          if (expire) {
            advanceToMain(game, q.id);
            advanceToMain(game, p.id);
          }
          const printed = cheap ? 2 : 5,
            cost = expire ? printed : Math.max(0, printed - amount),
            first = p.cards(ally, { zone: "hand" })[0]!;
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (cost > 0) {
            const before = game.state;
            expect(() => p.activate(first, { reservePayment: pay(cost - 1) })).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(first, { reservePayment: pay(cost) });
          passEffectsStack(game);
          expect(game.state.objects[first.objectId]!.zone).toBe("field");
          const second = p.card(ally, { zone: "hand" }),
            before = game.state;
          expect(() => p.activate(second, { reservePayment: pay(printed - 1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(second, { reservePayment: pay(printed) });
          passEffectsStack(game);
          expect(p.cards(ally, { zone: "field" })).toHaveLength(2);
        });
  it("never discounts an opposing activation", () => {
    const champion = grantTestChampionLevel(
      createClassBonusTestChampion(card, false, "activation-discount"),
      2,
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [card] } },
      playerTwo: { champion, zones: { hand: [grayWolf, woodlandSquirrels, woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    q.pass();
    p.activateAbility(card, abilityId);
    passEffectsStack(game);
    const before = game.state;
    expect(() => q.activate(grayWolf)).toThrow();
    expect(game.state).toEqual(before);
    q.activate(grayWolf, {
      reservePayment: q.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(q.cards(grayWolf, { zone: "field" })).toHaveLength(1);
  });
}
