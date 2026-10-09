import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { condemningEvisceration } from "./condemning-evisceration.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
/** @covers r84E55KBLM-a1
 * @covers r84E55KBLM-a2
 */
describe("Condemning Evisceration — prepared champion hit optionally banishes Floating Memory for damage", () => {
  for (const matching of [false, true])
    for (const mode of ["missing", "declined", "prepared"] as const)
      for (const championHit of [false, true])
        for (const available of [false, true])
          for (const accept of [false, true])
            it(`class=${matching}, mode=${mode}, champion hit=${championHit}, Floating Memory=${available}, accept=${accept}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(
                  condemningEvisceration,
                  matching,
                  "activation-discount",
                ),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      condemningEvisceration,
                      acceptedContract,
                      reclaim,
                      ...Array.from({ length: 7 }, () => woodlandSquirrels),
                    ],
                    graveyard: [woodlandSquirrels, ...(available ? [reclaim, reclaim] : [])],
                  },
                },
                playerTwo: { champion, zones: { field: [giantTortoise], graveyard: [reclaim] } },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                hero = p.card(champion),
                target = championHit ? q.card(champion) : q.card(giantTortoise),
                source = p.card(condemningEvisceration),
                pay = (n: number) =>
                  p
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .slice(0, n)
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              if (mode !== "missing") {
                p.activate(acceptedContract, { reservePayment: pay(5) });
                passEffectsStack(game);
              }
              const options = { attackAttackerId: hero.objectId, reservePayment: pay(2) },
                before = game.state;
              if (mode === "missing" || !matching) {
                expect(() =>
                  p.activate(source, { ...options, prepareAbilityIndexes: [0] }),
                ).toThrow();
                expect(game.state).toEqual(before);
                if (mode === "prepared") return;
              }
              p.activate(source, {
                ...options,
                ...(mode === "prepared" ? { prepareAbilityIndexes: [0] as const } : {}),
              });
              expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
                mode === "missing" ? 0 : mode === "prepared" ? 2 : 3,
              );
              expect(game.state.stack.at(-1)?.activationStates.includes("prepared")).toBe(
                mode === "prepared",
              );
              passEffectsStack(game);
              declareResolvedAttack(
                game,
                hero.objectId,
                target.objectId,
                "Condemning Evisceration",
              );
              let optional = 0,
                choices = 0;
              const start = game.state.eventHistory.length;
              for (
                let i = 0;
                i < 96 && (game.state.combat || game.state.stack.length || game.state.decision);
                i++
              ) {
                const d = game.state.decision;
                if (d?.kind === "choose-retaliators") answerDecision(game, d.kind, []);
                else if (d?.kind === "resolve-optional-effect") {
                  optional++;
                  answerDecision(game, d.kind, accept);
                } else if (d?.kind === "resolve-effect-choice") {
                  choices++;
                  const current = game.state;
                  for (const ids of [
                    [],
                    [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                    [q.card(reclaim).objectId],
                    [p.card(reclaim, { zone: "hand" }).objectId],
                    p.cards(reclaim, { zone: "graveyard" }).map((c) => c.objectId),
                  ]) {
                    expect(() => answerDecision(game, d.kind, ids)).toThrow();
                    expect(game.state).toEqual(current);
                  }
                  answerDecision(game, d.kind, [
                    p.cards(reclaim, { zone: "graveyard" })[0]!.objectId,
                  ]);
                } else {
                  const w = game.waitState();
                  if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
                  game.player(w.playerId).pass();
                }
              }
              const eligible = mode === "prepared" && championHit && available,
                extra = eligible && accept;
              expect(optional).toBe(eligible ? 1 : 0);
              expect(choices).toBe(extra ? 1 : 0);
              expect(game.state.objects[target.objectId]!.damage).toBe(extra ? 8 : 4);
              expect(p.cards(reclaim, { zone: "banishment" })).toHaveLength(extra ? 1 : 0);
              expect(p.cards(reclaim, { zone: "graveyard" })).toHaveLength(
                (available ? 2 : 0) - (extra ? 1 : 0),
              );
              expect(q.cards(reclaim, { zone: "graveyard" })).toHaveLength(1);
              const hits = game.state.eventHistory
                .slice(start)
                .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId);
              expect(hits).toHaveLength(extra ? 2 : 1);
              if (extra)
                expect(hits[1]).toMatchObject({
                  amount: 4,
                  sourceId: source.objectId,
                });
              if (extra) expect(hits[1]).not.toMatchObject({ combatDamage: true });
              expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
            });
});
