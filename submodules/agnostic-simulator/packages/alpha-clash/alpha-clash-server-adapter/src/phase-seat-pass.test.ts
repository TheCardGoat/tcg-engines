import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const body = getCard("ac-ac1-027");
const seats = { p1: "player-one", p2: "player-two" } as const;
const context = { gameId: "phase-seat-pass", sourceAuthority: "server" as const };
const steps = [
  "counter",
  "obstruct",
  "attackerBuff",
  "defenderBuff",
  "beforeDamage",
  "beforeDamage",
] as const;
const cases = (["player-one", "player-two"] as const).flatMap((active) =>
  steps.map((step, passes) => ({ active, step, passes })),
);

it.each(cases)(
  "$active: only the decision seat can pass $step after $passes passes",
  ({ active, step, passes }) => {
    const defender = active === "player-one" ? "player-two" : "player-one";
    const game = Spec.fromFixture({
      activePlayer: active,
      turnNumber: 3,
      playerOne: { clash: [body] },
      playerTwo: { clash: [body] },
    });
    game.asPlayer(active).attack(body, game.asPlayer(defender).contender());
    const progression = [defender, defender, active, defender, active] as const;
    for (const seat of progression.slice(0, passes)) game.asPlayer(seat).passRound();
    expect(game.state.clash?.step).toBe(step);
    const decision = passes === 2 || passes === 4 ? active : defender;
    const actor = decision === "player-one" ? "p1" : "p2";
    const waiting = actor === "p1" ? "p2" : "p1";
    // The same priority must survive persistence and must gate raw commands,
    // not just hide the waiting seat's button.
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(game.state)), seats);
    expect(engine.getActivePlayerId()).toBe(actor);
    expect(
      engine
        .getInteractionView(waiting)
        .actions.filter((action) => action.enabled)
        .map((action) => action.id),
    ).toEqual(["concede"]);
    const before = structuredClone(engine.state);
    const version = engine.getStateID();
    const rejected = engine.dispatch("pass", waiting, {}, context);
    expect(rejected.success).toBe(false);
    expect(engine.state).toEqual(before);
    expect(engine.getStateID()).toBe(version);
    expect(engine.canUndo(waiting)).toBe(false);
    const view = engine.getInteractionView(actor);
    const action = view.actions.find(
      (action) =>
        action.enabled && ["passCounter", "passObstruct", "passClashStep"].includes(action.id),
    );
    if (!action) throw new Error("Missing legal phase pass");
    const result = engine.submitInteraction(
      actor,
      buildInteractionSubmission({ view, action, values: {} }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(engine.getStateID()).toBe(version + 1);
    expect(engine.state).not.toEqual(before);
  },
);
