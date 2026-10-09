import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { huajiOfHeavensRise } from "./huaji-of-heavens-rise.ts";
import { virgilAlteredFuture } from "../../PRD/allies/virgil-altered-future.ts";
import { turmSchwartzRook } from "../../PTM/allies/turm-schwartz-rook.ts";
import { strappingConscript } from "../../DOA/allies/strapping-conscript.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
function championFor(matching: boolean, exia: boolean) {
  const base = enableAllTestElements(
    createClassBonusTestChampion(huajiOfHeavensRise, matching, "activation-discount"),
  );
  const face = requireSingleFace(base);
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...face, elements: exia ? ["EXIA" as const] : ["NORM" as const] },
    },
  };
}
function endTurn(game: GrandArchiveTestEngine, accept: boolean, next: string) {
  let offered = false;
  for (let i = 0; i < 128; i++) {
    if (game.state.turn.playerId === next && game.state.turn.phase === "main") return offered;
    const decision = game.state.decision;
    if (decision?.kind === "resolve-optional-effect") {
      offered = true;
      answerDecision(game, "resolve-optional-effect", accept);
    } else if (decision?.kind === "resolve-effect-payment") {
      offered = true;
      const p = game.player(decision.playerId);
      const pay = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (accept) {
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-effect-payment", { reservePayment: pay.slice(0, 2) }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-payment", accept ? { reservePayment: pay } : false);
    } else {
      const wait = game.waitState();
      if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else throw new Error(`Unexpected ${wait.kind}`);
    }
  }
  throw new Error("Did not finish end phase");
}
/** @covers v1iyt8rugx-a1 */
describe("Huaji of Heaven's Rise — permitted weapon users", () => {
  for (const matching of [false, true])
    for (const kind of [
      "champion",
      "unique-warrior",
      "unique-other",
      "ordinary-warrior",
      "ordinary-other",
    ])
      for (const opposing of [false, true]) {
        it(`class=${matching}, attacker=${kind}, opposing weapon=${opposing}`, () => {
          const champion = championFor(matching, false);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [
                  huajiOfHeavensRise,
                  virgilAlteredFuture,
                  turmSchwartzRook,
                  strappingConscript,
                  woodlandSquirrels,
                ],
              },
            },
            playerTwo: { champion, zones: { field: [huajiOfHeavensRise] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = (opposing ? q : p).card(huajiOfHeavensRise),
            attacker = p.card(
              kind === "champion"
                ? champion
                : kind === "unique-warrior"
                  ? virgilAlteredFuture
                  : kind === "unique-other"
                    ? turmSchwartzRook
                    : kind === "ordinary-warrior"
                      ? strappingConscript
                      : woodlandSquirrels,
            ),
            target = q.card(champion);
          const legal =
            !opposing && (kind === "champion" || (matching && kind === "unique-warrior"));
          if (!legal) {
            const before = game.state;
            expect(() =>
              p.declareAttack(attacker, target, { weaponIds: [source.objectId] }),
            ).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.declareAttack(attacker, target, { weaponIds: [source.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(kind === "champion" ? 1 : 3);
          expect(game.state.objects[source.objectId]!.counters.durability).toBe(1);
          if (kind !== "champion")
            expect(game.state.objects[p.card(champion).objectId]!.states.has("rested")).toBe(false);
        });
      }
});
/** @covers v1iyt8rugx-a2 */
describe("Huaji of Heaven's Rise — end-phase transformation", () => {
  for (const matching of [false, true])
    for (const exia of [false, true])
      for (const accept of [false, true])
        for (const opposing of [false, true]) {
          it(`class=${matching}, EXIA=${exia}, pay=${accept}, opponent end=${opposing}`, () => {
            const champion = championFor(matching, exia),
              deck = Array.from({ length: 6 }, () => woodlandSquirrels);
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: opposing ? "playerTwo" : "playerOne",
              playerOne: {
                champion,
                zones: {
                  field: [huajiOfHeavensRise],
                  hand: Array.from({ length: 3 }, () => woodlandSquirrels),
                  "main-deck": deck,
                },
              },
              playerTwo: { champion, zones: { "main-deck": deck } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(huajiOfHeavensRise),
              initial = game.state.objects[source.objectId]!;
            const offered = endTurn(game, accept, opposing ? p.id : q.id),
              eligible = matching && exia && !opposing;
            expect(offered).toBe(eligible);
            expect(game.state.objects[source.objectId]!.face).toBe(
              eligible && accept ? "transformed" : "default",
            );
            expect(game.state.objects[source.objectId]!.incarnation).toBe(initial.incarnation);
            expect(game.state.objects[source.objectId]!.counters.durability).toBe(2);
            expect(p.zone("memory")).toHaveLength(eligible && accept ? 3 : 0);
          });
        }
});
/** @covers reks5jzk7c-a1 */
/** @covers reks5jzk7c-a2 */
describe("Huaji of Abyssal Fall — attack damage choice", () => {
  for (const ally of [false, true])
    for (const accept of [false, true]) {
      it(`ally attacker=${ally}, accept damage=${accept}`, () => {
        const champion = championFor(true, true),
          deck = Array.from({ length: 8 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [huajiOfHeavensRise, virgilAlteredFuture],
              hand: Array.from({ length: 3 }, () => woodlandSquirrels),
              "main-deck": deck,
            },
          },
          playerTwo: { champion, zones: { "main-deck": deck } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(huajiOfHeavensRise),
          attacker = p.card(ally ? virgilAlteredFuture : champion),
          target = q.card(champion);
        endTurn(game, true, q.id);
        expect(game.state.objects[source.objectId]!.face).toBe("transformed");
        advanceToMain(game, p.id, game.state.turn.number);
        const start = game.state.eventHistory.length;
        p.declareAttack(attacker, target, { weaponIds: [source.objectId] });
        passEffectsStack(game);
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        const damage = game.state.eventHistory
          .slice(start)
          .filter((e) => e.type === "damage-marked" && e.objectId === attacker.objectId)
          .reduce((sum, e) => sum + (e.type === "damage-marked" ? e.amount : 0), 0);
        expect(damage).toBe(accept ? 10 : 0);
        expect(game.state.objects[attacker.objectId]!.zone).toBe(
          ally && accept ? "graveyard" : "field",
        );
        expect(game.state.objects[target.objectId]!.damage).toBe(
          ally ? (accept ? 0 : 5) : accept ? 6 : 3,
        );
        expect(game.state.objects[source.objectId]!.counters.durability).toBe(
          ally && accept ? 2 : 1,
        );
      });
    }
});
