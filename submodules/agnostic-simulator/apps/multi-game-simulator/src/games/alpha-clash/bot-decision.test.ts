// Owns cloned planning and validated command transport, not card-behavior coverage.
import { expect, test } from "vite-plus/test";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { createAlphaClashBotPlanner } from "./bot-decision";

test("Alpha Clash plans one validated command without advancing its authoritative engine", () => {
  const fixture = Spec.fromFixture({
    phase: { name: "expansion", step: "resource" },
    playerOne: { resource: 8 },
  });
  const engine = new AlphaClashServerEngine(fixture.state, {
    human: "player-one",
    bot: "player-two",
  });
  const plan = createAlphaClashBotPlanner(structuredClone(engine.playerIdToSeat));
  const context = { gameId: "parity", sourceAuthority: "server" as const };
  for (let step = 0; step < 8 && !engine.hasGameEnded(); step++) {
    const before = structuredClone(engine.state);
    const { command } = plan(structuredClone({ state: engine.state, strategyId: "default" }));
    expect(engine.state).toEqual(before);
    expect(command).not.toBeNull();
    if (!command) break;
    const clone = new AlphaClashServerEngine(structuredClone(engine.state), engine.playerIdToSeat);
    const expected = clone.takeAutomatedAction({ strategyId: "default" }, context);
    const { type, ...payload } = command;
    const actual = engine.dispatch(type, engine.getActivePlayerId()!, payload, context);
    expect(actual.success).toBe(expected.finalResult.success);
    expect(engine.state).toEqual(clone.state);
  }
});
