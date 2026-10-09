import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { disenchant } from "../cards/P25/actions/disenchant.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveSupportedStealth(card: Card, support: Card, phantasia: boolean) {
  for (const mode of ["none", "own", "opponent", "graveyard", "banishment", "removed", "partial"])
    for (const interaction of ["ordinary", "true-sight", "spell"])
      it(`requires own support: mode=${mode}, interaction=${interaction}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(fireball, true, "activation-discount"),
        );
        const ownSupports =
          mode === "partial"
            ? [support, support]
            : ["own", "removed"].includes(mode)
              ? [support]
              : [];
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [card, woodlandSquirrels, ...ownSupports],
              graveyard: mode === "graveyard" ? [support] : [],
              banishment: mode === "banishment" ? [support] : [],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [
                woodlandSquirrels,
                stillwaterPatrol,
                ...(mode === "opponent" ? [support] : []),
              ],
              hand: [
                fireball,
                sparkAlight,
                disenchant,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          defender = p.card(card);
        const payment = () =>
          q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const attack = (trueSight: boolean) =>
          q.declareAttack(
            q.card(trueSight ? stillwaterPatrol : woodlandSquirrels, { zone: "field" }),
            defender,
          );
        if (["removed", "partial"].includes(mode)) {
          const before = game.state;
          expect(() => attack(false)).toThrow();
          expect(game.state).toEqual(before);
          q.activate(phantasia ? disenchant : sparkAlight, {
            reservePayment: payment(),
            targets: { "target-1": [p.cards(support, { zone: "field" })[0]!.objectId] },
          });
          passEffectsStack(game);
          expect(p.cards(support, { zone: "field" })).toHaveLength(mode === "partial" ? 1 : 0);
        }
        const active = ["own", "partial"].includes(mode);
        if (interaction === "ordinary" && active) {
          const before = game.state;
          expect(() => attack(false)).toThrow();
          expect(game.state).toEqual(before);
          q.declareAttack(
            q.card(woodlandSquirrels, { zone: "field" }),
            p.card(woodlandSquirrels, { zone: "field" }),
          );
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[defender.objectId]!.damage).toBe(0);
          return;
        }
        if (interaction === "spell") {
          q.activate(fireball, {
            reservePayment: payment(),
            targets: { "target-1": [defender.objectId] },
          });
          passEffectsStack(game);
        } else {
          attack(interaction === "true-sight");
          game.resolveCombatWithoutRetaliation();
        }
        const life = grandArchiveTestFace(card).stats.life;
        if (typeof life !== "number") throw new Error("Expected printed life");
        const damage = interaction === "true-sight" ? (active ? 3 : 2) : 1;
        expect(game.state.objects[defender.objectId]!.zone).toBe(
          damage >= life ? "graveyard" : "field",
        );
        expect(game.state.objects[defender.objectId]!.damage).toBe(damage >= life ? 0 : damage);
      });
}
