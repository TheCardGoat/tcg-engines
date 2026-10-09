import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { blazingDirewolf } from "../cards/DOA/allies/blazing-direwolf.ts";
import { lakesideSerpent } from "../cards/DOA/allies/lakeside-serpent.ts";
import { weissKnight } from "../cards/PTM/allies/weiss-knight.ts";
import { beltedTune } from "../cards/PRD/actions/belted-tune.ts";
import { lightTheHunt } from "../cards/P25/actions/light-the-hunt.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";

export function proveConditionalAttackTarget(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mode: "life" | "human",
  cost: number,
  bonus: number,
) {
  for (const matching of [false, true])
    for (const scenario of [
      "champion",
      "human-champion",
      "four",
      "five",
      "six",
      "human-ally",
      "buffed-four",
      "response-four",
    ]) {
      it(`class=${matching}, target=${scenario}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const face = requireSingleFace(champion);
        const opponent = {
          ...champion,
          canonicalId: `${champion.canonicalId}-opponent`,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...face,
              typeLine: {
                ...face.typeLine,
                subtypes: scenario === "human-champion" ? ["HUMAN" as const] : ["SPIRIT" as const],
              },
            },
          },
        };
        const ally =
          scenario === "five"
            ? lakesideSerpent
            : scenario === "six"
              ? giantTortoise
              : scenario === "human-ally"
                ? weissKnight
                : blazingDirewolf;
        const isChampion = scenario.endsWith("champion"),
          buffed = scenario === "buffed-four";
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                ...(buffed ? [beltedTune] : []),
                ...Array.from({ length: cost + (buffed ? 2 : 0) }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [ally],
              hand:
                scenario === "response-four"
                  ? [lightTheHunt, woodlandSquirrels, woodlandSquirrels]
                  : [],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          target = q.card(isChampion ? opponent : ally),
          attack = p.card(card);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (buffed) {
          p.activate(beltedTune, {
            reservePayment: pay(2),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
        }
        p.activate(attack, { attackAttackerId: hero.objectId, reservePayment: pay(cost) });
        passEffectsStack(game);
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[attack.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(power()).toBe(2);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Declare conditional attack");
        const qualifies =
          mode === "human"
            ? scenario.startsWith("human-")
            : ["five", "six", "buffed-four"].includes(scenario);
        let expected = 2 + (matching && qualifies ? bonus : 0);
        expect(power()).toBe(expected);
        if (scenario === "response-four") {
          p.pass();
          q.activate(lightTheHunt, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expected = 2 + (matching && mode === "life" ? bonus : 0);
          expect(power()).toBe(expected);
        }
        const historyStart = game.state.eventHistory.length;
        game.resolveCombatWithoutRetaliation();
        const damage = game.state.eventHistory
          .slice(historyStart)
          .filter((event) => event.type === "damage-marked" && event.objectId === target.objectId);
        expect(damage.map((event) => (event.type === "damage-marked" ? event.amount : 0))).toEqual([
          expected,
        ]);
        expect(game.state.combat).toBeNull();
      });
    }
}
