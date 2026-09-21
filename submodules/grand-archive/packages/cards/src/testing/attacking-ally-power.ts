import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision } from "./decisions.ts";

export function proveAttackingAllyPower({
  card,
  basePower,
  bonus,
  requiresRested,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  basePower: number;
  bonus: number;
  requiresRested: boolean;
}) {
  for (const mode of ["awake-ally", "rested-ally", "champion", "retaliation"] as const) {
    it(`deals the printed conditional power during ${mode}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: mode === "rested-ally" || mode === "retaliation" ? "playerTwo" : "playerOne",
        playerOne: { champion, zones: { field: [card], "main-deck": [woodlandSquirrels] } },
        playerTwo: {
          champion,
          zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        ally = p.card(card),
        tortoise = q.card(giantTortoise);
      if (mode === "rested-ally") {
        q.declareAttack(tortoise, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        advanceToMain(game, p.id);
        expect(game.state.objects[tortoise.objectId]!.states.has("rested")).toBe(true);
      }
      if (mode === "retaliation") {
        q.declareAttack(tortoise, ally);
        for (let step = 0; game.state.combat && step < 64; step++) {
          if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", [ally.objectId]);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(game.state.objects[tortoise.objectId]!.damage).toBe(basePower);
      } else {
        const target = mode === "champion" ? q.card(champion) : tortoise;
        p.declareAttack(ally, target);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          basePower +
            (mode !== "champion" && (!requiresRested || mode === "rested-ally") ? bonus : 0),
        );
      }
    });
  }
}
