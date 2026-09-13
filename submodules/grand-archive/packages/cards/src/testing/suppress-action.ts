import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";
export function proveSuppressAction({
  card,
  cost,
  targetId,
  maximum = 1,
  optional = false,
  regalia = false,
  opponentOnly = false,
  counter,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  targetId: string;
  maximum?: number;
  optional?: boolean;
  regalia?: boolean;
  opponentOnly?: boolean;
  counter?: "enlighten" | "preparation";
}): void {
  for (const classBonus of counter ? [false, true] : [false])
    for (const count of optional ? [0, maximum] : [1])
      for (const weapon of regalia ? [false, true] : [false])
        for (const own of opponentOnly ? [false] : [false, true])
          it(`suppresses ${count} ${weapon ? "regalia" : "allies"} until the next end phase, class=${classBonus}, own=${own}`, () => {
            const champion = createClassBonusTestChampion(card, classBonus, "activation-discount"),
              field = [woodlandSquirrels, grayWolf, trainingSword];
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                  field,
                  "main-deck": [woodlandSquirrels],
                },
              },
              playerTwo: { champion, zones: { field, "main-deck": [woodlandSquirrels] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              primary = (own ? p : q).card(weapon ? trainingSword : woodlandSquirrels, {
                zone: "field",
              }),
              secondary = (own ? q : p).card(woodlandSquirrels, { zone: "field" });
            const selected: GrandArchiveObjectId[] =
              count === 0
                ? []
                : count === 1
                  ? [primary.objectId]
                  : [primary.objectId, secondary.objectId];
            const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const wrong = [
              p.card(champion),
              ...(opponentOnly ? [secondary] : []),
              ...(!regalia ? [q.card(trainingSword)] : []),
            ];
            for (const ref of wrong) {
              const before = game.state;
              expect(() =>
                p.activate(card, {
                  reservePayment: payment,
                  targets: { [targetId]: [ref.objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const before = game.state;
            expect(() =>
              p.activate(card, {
                reservePayment: payment,
                targets: { [targetId]: [primary.objectId, primary.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(card, { reservePayment: payment, targets: { [targetId]: selected } });
            expect(game.state.objects[primary.objectId]!.zone).toBe("field");
            passEffectsStack(game);
            for (const id of selected) {
              expect(game.state.objects[id]!.zone).toBe("banishment");
            }
            expect(game.state.objects[q.card(grayWolf).objectId]!.zone).toBe("field");
            if (counter) {
              expect(game.state.objects[p.card(champion).objectId]!.counters[counter] ?? 0).toBe(
                classBonus ? 1 : 0,
              );
              expect(game.state.objects[q.card(champion).objectId]!.counters[counter] ?? 0).toBe(0);
            }
            advanceToMain(game, q.id, -1, true);
            for (const ref of [primary, ...(count > 1 ? [secondary] : [])]) {
              expect(game.state.objects[ref.objectId]!.zone).toBe("field");
              expect(game.state.objects[ref.objectId]!.controllerId).toBe(ref.ownerId);
            }
            if (count > 0 && !weapon && !own) {
              q.declareAttack(primary, p.card(champion));
              game.resolveCombatWithoutRetaliation();
              expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
            }
          });
}
