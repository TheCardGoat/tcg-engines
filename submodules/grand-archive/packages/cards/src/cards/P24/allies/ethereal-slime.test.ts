import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { etherealSlime } from "./ethereal-slime.ts";

/** @covers n06zlhihka-a1 */
describe("Ethereal Slime — printed keywords", () => {
  proveKeywordGroup({
    card: etherealSlime,
    keywords: [
      {
        name: "pride",
        value: 3,
      },
      {
        name: "stealth",
      },
      {
        name: "true-sight",
      },
    ],
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  proveLevelNoncombatPrevention,
  proveTemporaryLevelPrevention,
} from "../../../testing/level-noncombat-prevention.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fluteOfTaming } from "../../DOA/items/flute-of-taming.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
/** @covers n06zlhihka-a3 */
describe("Ethereal Slime — Level 5 non-combat prevention", () => {
  proveLevelNoncombatPrevention(etherealSlime, 5);
  proveTemporaryLevelPrevention(etherealSlime, 5);
});
/** @covers n06zlhihka-a2 */
describe("Ethereal Slime — optional Tamer material banishment", () => {
  for (const matching of [false, true])
    for (const location of [
      "material-deck",
      "hand",
      "graveyard",
      "banishment",
      "opponent",
      "none",
    ] as const)
      for (const accept of [false, true])
        it(`class=${matching}, Tamer=${location}, accept=${accept}`, () => {
          const champion = grantTestChampionLevel(
            enableAllTestElements(
              createClassBonusTestChampion(etherealSlime, matching, "activation-discount"),
            ),
            3,
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  etherealSlime,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  ...(location === "hand" ? [fluteOfTaming] : []),
                ],
                "material-deck": [
                  trainingSword,
                  ...(location === "material-deck" ? [fluteOfTaming, fluteOfTaming] : []),
                ],
                ...(location === "graveyard" || location === "banishment"
                  ? { [location]: [fluteOfTaming] }
                  : {}),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [shimmercloakAssassin],
                "material-deck": location === "opponent" ? [fluteOfTaming] : [],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(etherealSlime),
            deck = p.zone("main-deck");
          const material = p.cards(fluteOfTaming, { zone: "material-deck" }),
            valid = matching && location === "material-deck" && accept;
          p.activate(source, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          if (matching && game.state.decision?.kind === "resolve-optional-effect") {
            if (accept && location !== "material-deck") {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-optional-effect", valid);
            passEffectsStack(game);
            if (valid) {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [p.card(trainingSword).objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-effect-choice", [material[0]!.objectId]);
              passEffectsStack(game);
            }
          }
          expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(valid ? 1 : 0);
          expect(p.zone("main-deck")).toEqual(deck.slice(valid ? 1 : 0));
          if (valid) expect(p.zone("hand")).toContainEqual(deck[0]);
          expect(p.cards(fluteOfTaming, { zone: "material-deck" })).toHaveLength(
            location === "material-deck" ? (valid ? 1 : 2) : 0,
          );
          if (valid) expect(game.state.objects[material[0]!.objectId]!.zone).toBe("banishment");
          expect(q.cards(fluteOfTaming, { zone: "material-deck" })).toHaveLength(
            location === "opponent" ? 1 : 0,
          );
          const target = q.card(shimmercloakAssassin),
            start = game.state.eventHistory.length;
          p.declareAttack(source, target);
          game.resolveCombatWithoutRetaliation();
          expect(
            game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
              .map((e) => (e.type === "damage-marked" ? e.amount : 0)),
          ).toEqual([valid ? 3 : 2]);
          expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          expect(game.state.decision).toBeNull();
        });
});
