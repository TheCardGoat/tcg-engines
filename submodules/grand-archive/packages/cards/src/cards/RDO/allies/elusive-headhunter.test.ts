import { describe } from "vitest";
import { elusiveHeadhunter } from "./elusive-headhunter.ts";
import { proveUnretaliatedAttacks } from "../../../testing/unretaliated-attacks.ts";
/** @covers KmM2o1ozGr-a1 */
describe("Elusive Headhunter — only its attacks cannot be retaliated", () =>
  proveUnretaliatedAttacks(elusiveHeadhunter));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { enragedBoars } from "../../DOA/allies/enraged-boars.ts";
/** @covers KmM2o1ozGr-a2 */
describe("Elusive Headhunter — class kill grants this-turn Agility 3", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 3, 5])
      for (const mode of ["kill", "survive", "other-kill"] as const)
        it(`class=${matching}, memory=${count}, mode=${mode}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(elusiveHeadhunter, matching, "activation-discount"),
            5,
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [elusiveHeadhunter, enragedBoars],
                memory: Array.from({ length: count }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [enragedBoars, giantTortoise], "main-deck": [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = q.card(mode === "survive" ? giantTortoise : enragedBoars),
            memory = p.zone("memory");
          p.declareAttack(mode === "other-kill" ? enragedBoars : elusiveHeadhunter, target);
          game.resolveCombatWithoutRetaliation();
          const enabled = matching && mode === "kill";
          expect(game.state.objects[target.objectId]!.zone).toBe(
            mode === "survive" ? "field" : "graveyard",
          );
          expect(game.state.players[p.id]!.states.agility === true).toBe(enabled);
          expect(p.zone("memory")).toEqual(memory);
          for (
            let i = 0;
            i < 96 && !(game.state.turn.playerId === q.id && game.state.turn.phase === "main");
            i++
          ) {
            const d = game.state.decision;
            if (d?.kind === "resolve-effect-choice") {
              expect(enabled).toBe(true);
              expect(game.state.turn.phase).toBe("end");
              const selected = memory.slice(-Math.min(3, count));
              const before = game.state;
              expect(() => answerDecision(game, d.kind, [])).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(
                game,
                d.kind,
                selected.map((c) => c.objectId),
              );
            } else {
              const w = game.waitState();
              if (w.kind === "opportunity") game.player(w.playerId).pass();
              else if (w.kind === "materialization-choice")
                game.player(w.playerId).execute({ move: "skip-materialization" });
              else throw new Error(`Unexpected ${w.kind}`);
            }
          }
          expect(game.state.turn.playerId).toBe(q.id);
          expect(game.state.turn.phase).toBe("main");
          expect(p.zone("memory")).toHaveLength(count - (enabled ? Math.min(3, count) : 0));
          expect(p.zone("hand")).toHaveLength(enabled ? Math.min(3, count) : 0);
          expect(game.state.players[p.id]!.states.agility).not.toBe(true);
        });
});
for (const retaliating of [false, true])
  it(`Elusive Headhunter stacks kill Agility, retaliation=${retaliating}`, () => {
    const champion = grantTestChampionLevel(
      createClassBonusTestChampion(elusiveHeadhunter, true, "activation-discount"),
      5,
    );
    const count = retaliating ? 5 : 7;
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: retaliating ? "playerTwo" : "playerOne",
      playerOne: {
        champion,
        zones: {
          field: [elusiveHeadhunter, ...(!retaliating ? [elusiveHeadhunter] : [])],
          memory: Array.from({ length: count }, () => woodlandSquirrels),
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [enragedBoars, ...(!retaliating ? [enragedBoars] : [])],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hunters = p.cards(elusiveHeadhunter, { zone: "field" }),
      victims = q.cards(enragedBoars, { zone: "field" });
    for (let i = 0; i < hunters.length; i++) {
      if (retaliating) q.declareAttack(victims[i]!, hunters[i]!);
      else p.declareAttack(hunters[i]!, victims[i]!);
      for (
        let step = 0;
        step < 64 && (game.state.combat || game.state.stack.length || game.state.decision);
        step++
      ) {
        const d = game.state.decision;
        if (d?.kind === "choose-retaliators")
          answerDecision(game, d.kind, retaliating ? [hunters[i]!.objectId] : []);
        else {
          const w = game.waitState();
          if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
          game.player(w.playerId).pass();
        }
      }
      expect(game.state.objects[victims[i]!.objectId]!.zone).toBe("graveyard");
    }
    expect(game.state.players[p.id]!.states.agility).toBe(true);
    if (retaliating) expect(game.state.objects[hunters[0]!.objectId]!.zone).toBe("graveyard");
    const active = game.state.turn.playerId;
    for (let i = 0; i < 96 && game.state.turn.playerId === active; i++) {
      const d = game.state.decision;
      if (d?.kind === "order-triggered-abilities")
        answerDecision(game, d.kind, d.pendingTriggerIds);
      else if (d?.kind === "resolve-effect-choice")
        answerDecision(
          game,
          d.kind,
          p
            .zone("memory")
            .slice(0, 3)
            .map((c) => c.objectId),
        );
      else {
        const w = game.waitState();
        if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
        game.player(w.playerId).pass();
      }
    }
    expect(game.state.turn.playerId).not.toBe(active);
    expect(p.zone("hand")).toHaveLength(retaliating ? 3 : 6);
    expect(p.zone("memory")).toHaveLength(retaliating ? 2 : 1);
    expect(game.state.players[p.id]!.states.agility).not.toBe(true);
  });
