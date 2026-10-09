import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import {
  createClassBonusTestChampion,
  requireSingleFace,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision } from "./decisions.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
export function proveUnretaliatedAttacks(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matching of [false, true])
    for (const championTarget of [false, true])
      for (const mode of ["source", "other", "hand", "banishment", "defending"] as const)
        it(`class=${matching}, champion=${championTarget}, mode=${mode}`, () => {
          const base = createClassBonusTestChampion(card, matching, "activation-discount"),
            champion = {
              ...base,
              layout: {
                kind: "single-faced" as const,
                face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: 1 } },
              },
            };
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: mode === "defending" ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, ...(mode === "hand" || mode === "banishment" ? [] : [card])],
                hand: mode === "hand" ? [card] : [],
                banishment: mode === "banishment" ? [card] : [],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = mode === "defending" ? q : p;
          const attacker =
              mode === "defending"
                ? q.card(championTarget ? champion : giantTortoise)
                : p.card(mode === "source" ? card : giantTortoise),
            target =
              mode === "defending"
                ? p.card(card)
                : q.card(championTarget ? champion : giantTortoise);
          actor.declareAttack(attacker, target);
          let offered = false;
          for (
            let i = 0;
            i < 64 && (game.state.combat || game.state.stack.length || game.state.decision);
            i++
          ) {
            const d = game.state.decision;
            if (d?.kind === "choose-retaliators") {
              expect(d.candidates).toContain(target.objectId);
              offered = true;
              answerDecision(game, d.kind, [target.objectId]);
            } else {
              const w = game.waitState();
              if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
              game.player(w.playerId).pass();
            }
          }
          expect(game.state.combat).toBeNull();
          expect(offered).toBe(mode !== "source");
          expect(game.state.objects[attacker.objectId]!.damage).toBe(
            mode === "source"
              ? 0
              : mode === "defending"
                ? grandArchiveTestFace(card).stats.power
                : 1,
          );
          if (mode !== "defending")
            expect(game.state.objects[target.objectId]!.damage).toBe(
              mode === "source" ? grandArchiveTestFace(card).stats.power : 1,
            );
        });
}
