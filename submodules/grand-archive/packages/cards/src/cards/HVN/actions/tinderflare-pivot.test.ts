import { describe } from "vitest";
import { tinderflarePivot } from "./tinderflare-pivot.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers s3bqtjayfn-a1 */
describe("Tinderflare Pivot — Kindle", () => {
  proveKindle(tinderflarePivot, 2, true);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { loneGunslinger } from "../../ALC/allies/lone-gunslinger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers s3bqtjayfn-a2 */
describe("Tinderflare Pivot makes Rangers distant and grants temporary additive Ranged", () => {
  for (const ownTurn of [false, true])
    for (const alreadyDistant of [false, true])
      it(`own turn=${ownTurn}, already distant=${alreadyDistant}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(tinderflarePivot, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownTurn ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [loneGunslinger, woodlandSquirrels],
              hand: [
                tinderflarePivot,
                reposition,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          ranger = p.card(loneGunslinger);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const opportunity = () => {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        };
        opportunity();
        if (alreadyDistant) {
          p.activate(reposition, {
            reservePayment: pay(1),
            targets: { "target-1": [ranger.objectId] },
          });
          passEffectsStack(game);
          opportunity();
        }
        for (const invalid of [p.card(champion), p.card(woodlandSquirrels, { zone: "field" })]) {
          const before = game.state;
          expect(() =>
            p.activate(tinderflarePivot, {
              reservePayment: pay(2),
              targets: { "target-1": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(tinderflarePivot, {
          reservePayment: pay(2),
          targets: { "target-1": [ranger.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[ranger.objectId]!.states.has("distant")).toBe(true);
        if (!ownTurn) advanceToMain(game, p.id);
        p.declareAttack(ranger, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(ownTurn ? 3 : 2);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        expect(game.state.objects[ranger.objectId]!.states.has("distant")).toBe(false);
        p.declareAttack(ranger, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe((ownTurn ? 3 : 2) + 1);
      });
});
