import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveTargetNextPrevention({
  card,
  cost,
  capacity,
  ownAlly = false,
  noncombat = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  capacity: number;
  ownAlly?: boolean;
  noncombat?: boolean;
}): void {
  for (const expired of [false, true])
    for (const own of ownAlly ? [true] : [false, true])
      for (const ally of ownAlly ? [true] : [false, true])
        for (const amount of [1, 4])
          it(`next event only: expired=${expired}, own=${own}, ally=${ally}, amount=${amount}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(card, false, "activation-discount"),
            );
            const caster = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(fireball, true, "activation-discount"),
                amount - 1,
              ),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                  field: [giantTortoise, trainingSword],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: caster,
                zones: {
                  hand: [
                    fireball,
                    fireball,
                    fireball,
                    ...Array.from({ length: 6 }, () => woodlandSquirrels),
                  ],
                  field: [giantTortoise, woodlandSquirrels],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              owner = own ? p : q;
            const target = owner.card(ally ? giantTortoise : own ? champion : caster);
            const reservePayment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
            const invalids = [
              p.card(trainingSword),
              ...(ownAlly ? [p.card(champion), q.card(giantTortoise)] : []),
            ];
            for (const invalid of invalids) {
              const before = game.state;
              expect(() =>
                p.activate(card, { reservePayment, targets: { "target-1": [invalid.objectId] } }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            // For a live shield, cast on the opponent's turn so subsequent damage is in the same turn.
            if (!expired) {
              advanceToMain(game, q.id);
              q.pass();
            }
            p.activate(card, { reservePayment, targets: { "target-1": [target.objectId] } });
            passEffectsStack(game);
            if (expired) advanceToMain(game, q.id);
            else if (game.waitState().kind === "opportunity") {
              const wait = game.waitState();
              if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
            }
            const unrelated = p.card(own && !ally ? giantTortoise : champion);
            q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
              targets: { "target-1": [unrelated.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[unrelated.objectId]!.damage).toBe(amount);
            let damage = 0;
            if (noncombat && own) {
              q.declareAttack(woodlandSquirrels, target);
              game.resolveCombatWithoutRetaliation();
              damage = 1;
              expect(game.state.objects[target.objectId]!.damage).toBe(1);
            }
            const spells = q.cards(fireball, { zone: "hand" });
            for (let index = 0; index < 2; index++) {
              q.activate(spells[index]!, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 2)
                  .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
                targets: { "target-1": [target.objectId] },
              });
              passEffectsStack(game);
              damage += !expired && index === 0 ? Math.max(0, amount - capacity) : amount;
              const destroyed = ally && damage >= 6;
              expect(game.state.objects[target.objectId]!.zone).toBe(
                destroyed ? "graveyard" : "field",
              );
              if (!destroyed) expect(game.state.objects[target.objectId]!.damage).toBe(damage);
            }
          });
}
