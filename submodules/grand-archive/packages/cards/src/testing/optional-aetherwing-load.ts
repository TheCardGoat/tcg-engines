import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect } from "vitest";
import { answerDecision, passEffectsStack } from "./decisions.ts";

/** Resolve the printed optional loading decision and check that invalid hosts do not mutate state. */
export function finishOptionalAetherwingLoad(
  game: GrandArchiveTestEngine,
  source: GrandArchiveObjectId,
  host: GrandArchiveObjectId,
  load: boolean,
  invalidHosts: readonly GrandArchiveObjectId[],
): void {
  expect(game.state.decision?.kind).toBe("resolve-optional-effect");
  expect(game.state.objects[source]!.zone).toBe("effects-stack");
  answerDecision(game, "resolve-optional-effect", load);
  passEffectsStack(game);
  if (load) {
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    for (const invalid of invalidHosts) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [invalid])).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "resolve-effect-choice", [host]);
    passEffectsStack(game);
    expect(game.state.objects[source]!.zone).toBe("loaded");
    expect(game.state.objects[source]!.hostId).toBe(host);
  } else expect(game.state.objects[source]!.zone).toBe("graveyard");
}
