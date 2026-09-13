import type { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect } from "vitest";
import { answerDecision } from "./decisions.ts";
/** Resolve combat through public passes and the opponent's explicit Critical payment. */
export function resolveCriticalCombat(
  game: GrandArchiveTestEngine,
  { amount, offered, pay }: { amount: number; offered: boolean; pay: boolean },
): void {
  let offers = 0;
  for (let i = 0; i < 64 && game.state.combat; i++) {
    const decision = game.state.decision;
    if (decision?.kind === "resolve-critical") {
      offers++;
      expect(decision.amount).toBe(amount);
      expect(decision.playerId).toBe(game.player("player-two").id);
      const q = game.player("player-two"),
        p = game.player("player-one"),
        before = game.state;
      expect(() =>
        answerDecision(
          game,
          "resolve-critical",
          Array.from({ length: amount }, () => p.card(p.zone("field")[0]!).objectId),
        ),
      ).toThrow();
      expect(game.state).toEqual(before);
      expect(() =>
        answerDecision(game, "resolve-critical", decision.candidates.slice(0, amount + 1)),
      ).toThrow();
      expect(game.state).toEqual(before);
      const selected = pay ? decision.candidates.slice(0, amount) : [];
      answerDecision(game, "resolve-critical", selected);
      for (const id of selected) expect(q.zone("graveyard").map((c) => c.objectId)).toContain(id);
    } else if (decision?.kind === "choose-retaliators")
      answerDecision(game, "choose-retaliators", []);
    else {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected combat wait ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
  }
  expect(game.state.combat).toBeNull();
  expect(offers).toBe(offered ? 1 : 0);
}
