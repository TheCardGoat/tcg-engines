import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { cheshireCatImpishGrin } from "./cheshire-cat-impish-grin.ts";

/** @covers cUltOcPo26-a1 */
describe("Cheshire Cat, Impish Grin — printed keywords", () => {
  proveKeywordGroup({
    card: cheshireCatImpishGrin,
    keywords: [
      {
        name: "spellshroud",
      },
      {
        name: "stealth",
      },
    ],
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { inertSword } from "../../DTR/weapons/inert-sword.ts";
import { swordOfShadows } from "../../DTR/weapons/sword-of-shadows.ts";
import { palvorSword } from "../../PTM/weapons/palvor-sword.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { breakApart } from "../actions/break-apart.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers cUltOcPo26-a3 */
describe("Cheshire Cat — current controlled weapons, base power", () => {
  for (const guardian of [false, true])
    for (const count of [0, 1, 2]) {
      it(`adds printed power only: Guardian=${guardian}, Distortion weapons=${count}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(inertSword, guardian, "activation-discount"),
        );
        const weapons = [inertSword, palvorSword].slice(0, count);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              field: [cheshireCatImpishGrin, trainingSword, ...weapons],
              hand: [breakApart, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              "material-deck": [swordOfShadows, inertSword],
              graveyard: [inertSword],
              banishment: [palvorSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [inertSword, palvorSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          cat = p.card(cheshireCatImpishGrin);
        const power = (id: typeof cat.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(power(cat.objectId)).toBe(1 + count * 2);
        if (count)
          expect(power(p.card(inertSword, { zone: "field" }).objectId)).toBe(guardian ? 3 : 2);
        p.materialize(swordOfShadows);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        expect(power(cat.objectId)).toBe(2 + count * 2);
        p.declareAttack(cat, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2 + count * 2);
        if (count) {
          const removed = p.card(inertSword, { zone: "field" });
          p.activate(breakApart, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 5)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [removed.objectId] },
          });
          passEffectsStack(game);
          expect(p.zone("banishment")).toContainEqual(removed);
          expect(power(cat.objectId)).toBe(count * 2);
        }
      });
    }
});
