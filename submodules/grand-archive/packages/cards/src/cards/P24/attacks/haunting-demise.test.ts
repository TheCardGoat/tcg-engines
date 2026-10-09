import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { hauntingDemise } from "./haunting-demise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { penumbralWaltz } from "../../MRC/actions/penumbral-waltz.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers v0buu5y0ub-a1 @covers v0buu5y0ub-a2 */
describe("Haunting Demise hit and inherited damage", () => {
  for (const matches of [false, true])
    for (const ally of [false, true])
      for (const prevent of [false, true])
        it(`enters only a hit champion's lineage with Class Bonus, class=${matches}, ally=${ally}, prevention=${prevent}`, () => {
          const attacker = enableAllTestElements(
            createClassBonusTestChampion(hauntingDemise, matches, "activation-discount"),
          );
          const defender = enableAllTestElements(lineageTestChampion("Defender", 0));
          const deck = () => Array.from({ length: 8 }, () => woodlandSquirrels);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: attacker,
              zones: { hand: [hauntingDemise, woodlandSquirrels], "main-deck": deck() },
            },
            playerTwo: {
              champion: defender,
              zones: {
                field: [giantTortoise],
                hand: [
                  penumbralWaltz,
                  penumbralWaltz,
                  ...Array.from({ length: 4 }, () => fireball),
                  ...Array.from({ length: 16 }, () => woodlandSquirrels),
                ],
                "main-deck": deck(),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(attacker),
            foe = q.card(defender),
            source = p.card(hauntingDemise),
            target = ally ? q.card(giantTortoise) : foe;
          if (prevent) {
            p.pass();
            q.activate(q.cards(penumbralWaltz, { zone: "hand" })[0]!, { variables: { X: 0 } });
            passEffectsStack(game);
          }
          p.activate(source, {
            attackAttackerId: hero.objectId,
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, target.objectId, "Haunting Demise attack");
          game.resolveCombatWithoutRetaliation();
          passEffectsStack(game);
          const hit = ally || !prevent,
            inherited = matches && !ally && hit;
          expect(game.state.objects[target.objectId]!.damage).toBe(hit ? 3 : 0);
          expect(game.state.objects[source.objectId]!.zone).toBe(
            inherited ? "inner-lineage" : "graveyard",
          );
          if (inherited) expect(game.state.objects[source.objectId]!.hostId).toBe(foe.objectId);
          const before = game.state.objects[foe.objectId]!.damage;
          advanceToRecollection(game, q.id);
          expect(game.state.objects[foe.objectId]!.damage).toBe(before);
          expect(game.state.stack).toHaveLength(inherited ? 1 : 0);
          if (inherited)
            q.activate(q.cards(penumbralWaltz, { zone: "hand" })[0]!, { variables: { X: 0 } });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(before + (inherited ? 1 : 0));
          if (inherited) {
            advanceToMain(game, q.id);
            const spells = q.cards(fireball, { zone: "hand" });
            for (let i = 0; i < 4; i++) {
              q.activate(spells[i]!, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 4)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                targets: { "target-1": [foe.objectId] },
              });
              passEffectsStack(game);
              expect(game.state.objects[foe.objectId]!.damage).toBe(before + 1 + (i === 3 ? 1 : 0));
            }
          }
          const current = game.state.objects[foe.objectId]!.damage;
          advanceToRecollection(game, p.id);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          expect(game.state.objects[foe.objectId]!.damage).toBe(current);
          advanceToRecollection(game, q.id);
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(current + (inherited ? 1 : 0));
        });
});
