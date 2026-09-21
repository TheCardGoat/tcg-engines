import { renascentSharpshooter } from "./renascent-sharpshooter.ts";
import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers gbnvtkm7rf-a1 */
describe("renascent-sharpshooter — Ranged combat", () => {
  proveRangedAlly({ card: renascentSharpshooter, power: 2, ranged: 1, classBonus: false });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { reposition } from "../../ALC/actions/reposition.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers gbnvtkm7rf-a2 */
describe("Renascent Sharpshooter — class-restricted distant trigger", () => {
  for (const matching of [false, true])
    for (const self of [false, true])
      it(`draws only for a new distant state on itself: class=${matching}, self=${self}`, () => {
        const champion = createClassBonusTestChampion(
          renascentSharpshooter,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [renascentSharpshooter],
              hand: [reposition, reposition, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one");
        const target = p.card(self ? renascentSharpshooter : champion);
        const top = p.zone("main-deck")[0]!;
        for (let cast = 0; cast < 2; cast++) {
          const action = p.cards(reposition, { zone: "hand" })[0]!;
          p.activate(action, {
            targets: { "target-1": [target.objectId] },
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
          expect(game.state.objects[top.objectId]!.zone).toBe(
            matching && self ? "memory" : "main-deck",
          );
          expect(p.zone("main-deck")).toHaveLength(matching && self ? 1 : 2);
          expect(p.zone("memory")).toHaveLength(cast + 1 + Number(matching && self));
        }
      });
});
