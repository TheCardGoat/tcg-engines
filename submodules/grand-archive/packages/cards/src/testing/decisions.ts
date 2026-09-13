import type { GrandArchiveDecision } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

/** Pass combat and decline retaliation, stopping at trigger targeting or before the named trigger resolves. */
export function advanceCombatToTrigger(game: GrandArchiveTestEngine, abilityId: string): void {
  for (let step = 0; step < 64; step++) {
    if (game.state.decision?.kind === "announce-triggered-ability") return;
    if (
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
      )
    )
      return;
    if (!game.state.combat) return;
    const wait = game.waitState();
    if (game.state.decision?.kind === "choose-retaliators")
      answerDecision(game, "choose-retaliators", []);
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected combat state ${wait.kind}`);
  }
  throw new Error("Combat did not reach the requested trigger or finish");
}

/** Deliberately decline responses, stopping at a real player decision or an empty stack. */
export function passEffectsStack(game: GrandArchiveTestEngine): void {
  for (let step = 0; step < 64; step++) {
    if (game.state.decision || game.state.stack.length === 0) return;
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Cannot pass Effects Stack at ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  throw new Error("Effects Stack did not settle after 64 passes");
}

/** Reach the named player's main phase through public passes and materialization skips. */
export function advanceToMain(
  game: GrandArchiveTestEngine,
  playerId: string,
  afterTurn = -1,
  orderTriggers = false,
): void {
  for (let step = 0; step < 256; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > afterTurn
    )
      return;
    const wait = game.waitState();
    if (orderTriggers && game.state.decision?.kind === "order-triggered-abilities")
      answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
    else if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error(`Did not reach ${playerId}'s main phase`);
}

/** Choose the unique resolved-attack declaration against one target with no weapons. */
export function declareResolvedAttack(
  game: GrandArchiveTestEngine,
  attackerId: string,
  targetId: string,
  description: string,
): void {
  const decision = game.state.decision;
  if (decision?.kind !== "declare-resolved-attack")
    throw new Error(`Expected declare-resolved-attack, found ${decision?.kind ?? "no decision"}`);
  game
    .player(decision.playerId)
    .executeLegal(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        typeof candidate.command.answer === "object" &&
        candidate.command.answer !== null &&
        "attackerId" in candidate.command.answer &&
        candidate.command.answer.attackerId === attackerId &&
        !("delegatePlayerId" in candidate.command.answer) &&
        !("cleavePlayerId" in candidate.command.answer) &&
        (!("weaponIds" in candidate.command.answer) ||
          (Array.isArray(candidate.command.answer.weaponIds) &&
            candidate.command.answer.weaponIds.length === 0)) &&
        "targetIds" in candidate.command.answer &&
        Array.isArray(candidate.command.answer.targetIds) &&
        candidate.command.answer.targetIds.length === 1 &&
        candidate.command.answer.targetIds.includes(targetId),
      description,
    );
}

/** Fresh decision snapshot. Mutating commands do not narrow `game.state.decision`. */
export function currentDecision(game: GrandArchiveTestEngine): GrandArchiveDecision | undefined {
  return game.state.decision ?? undefined;
}

/** Submit the same versioned decision answer a player would, without bypassing admission. */
export function answerDecision(
  game: GrandArchiveTestEngine,
  kind: GrandArchiveDecision["kind"],
  answer: unknown,
): void {
  const decision = game.state.decision;
  if (decision?.kind !== kind)
    throw new Error(`Expected ${kind}, found ${decision?.kind ?? "no decision"}`);
  game.player(decision.playerId).execute({
    move: "answer-decision",
    decisionId: decision.id,
    stateVersion: decision.stateVersion,
    answer,
  });
}
