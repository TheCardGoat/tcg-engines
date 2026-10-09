import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { proveSubtypeRetaliationRestriction } from "../../../testing/retaliation-restrictions.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { innocuousDisposer } from "./innocuous-disposer.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tactfulSergeant } from "../../DOA/allies/tactful-sergeant.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
/** @covers pd2aigr677-a1 */
describe("Innocuous Disposer — Human retaliation restriction", () =>
  proveSubtypeRetaliationRestriction("disposer"));
/** @covers pd2aigr677-a2 */
describe("Innocuous Disposer — preparation-paid Human destruction", () => {
  for (const matching of [false, true])
    for (const prepared of [false, true])
      for (const accept of [false, true])
        for (const targetKind of ["human", "animal", "champion"] as const)
          it(`class=${matching}, prepared=${prepared}, accept=${accept}, target=${targetKind}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(innocuousDisposer, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [innocuousDisposer],
                  hand: [acceptedContract, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
                },
              },
              playerTwo: { champion, zones: { field: [tactfulSergeant, giantTortoise] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              target = q.card(
                targetKind === "human"
                  ? tactfulSergeant
                  : targetKind === "animal"
                    ? giantTortoise
                    : champion,
              );
            if (prepared) {
              p.activate(acceptedContract, {
                reservePayment: p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              });
              passEffectsStack(game);
            }
            expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
              prepared ? 3 : 0,
            );
            p.declareAttack(innocuousDisposer, target);
            for (
              let i = 0;
              i < 64 && (game.state.combat || game.state.stack.length || game.state.decision);
              i++
            ) {
              const d = game.state.decision;
              if (d?.kind === "choose-retaliators") answerDecision(game, d.kind, []);
              else if (d?.kind === "resolve-optional-effect") answerDecision(game, d.kind, accept);
              else {
                const wait = game.waitState();
                if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
                game.player(wait.playerId).pass();
              }
            }
            const destroyed = matching && prepared && accept && targetKind === "human";
            expect(game.state.combat).toBeNull();
            expect(game.state.objects[target.objectId]!.zone).toBe(
              destroyed ? "graveyard" : "field",
            );
            if (!destroyed) expect(game.state.objects[target.objectId]!.damage).toBe(1);
            expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
              (prepared ? 3 : 0) - (destroyed ? 1 : 0),
            );
            expect(game.state.objects[p.card(innocuousDisposer).objectId]!.zone).toBe("field");
          });
});
