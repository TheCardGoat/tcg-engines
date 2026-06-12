import type { PlayerId } from "../../types/branded.ts";
import type { CommandEnvelope } from "../../types/commands.ts";
import type { AIStrategy, EngineHandle, MoveDecision } from "../types.ts";
import { greedyStrategy } from "../strategies/greedy.ts";
import { randomStrategy } from "../strategies/random.ts";
import { enumerateCandidateActions, runRollout } from "./shared.ts";

/**
 * Flat Monte Carlo strategy: for each candidate action, fork the engine,
 * apply the action, then run K rollouts to game-end using the configured
 * rollout policy. Pick the action with the highest empirical win-rate.
 *
 * Stronger than `greedyStrategy` because it actually evaluates outcomes
 * rather than following a static priority list. Slower per decision (K
 * rollouts × candidate count), but still fast enough for the bot-vs-bot
 * harness when K is small (default 10). For tree-shaped search instead
 * of flat MC, see `mctsStrategy`.
 *
 * Boundary-clean: uses only `EngineHandle` (filtered view + prompt +
 * processCommand + fork) — never raw `MatchState`.
 */
export interface MonteCarloOptions {
  /** Random rollouts per candidate action. Default 10. */
  rolloutsPerAction?: number;
  /** Hard cap on rollout depth so an unwinnable position doesn't hang. */
  maxRolloutSteps?: number;
  /**
   * Strategy used to drive both players during rollouts. Defaults to
   * `randomStrategy` — fast, unbiased noise. Switching to `greedyStrategy`
   * gives a sharper win-rate signal at the cost of more work per rollout
   * (each decision now runs greedy's heuristics instead of one rng() call).
   */
  rolloutStrategy?: AIStrategy;
}

export function createMonteCarloStrategy(opts: MonteCarloOptions = {}): AIStrategy {
  const rolloutsPerAction = opts.rolloutsPerAction ?? 10;
  const maxRolloutSteps = opts.maxRolloutSteps ?? 200;
  const rolloutStrategy = opts.rolloutStrategy ?? randomStrategy;
  return {
    name: `monte-carlo:${rolloutStrategy.name}`,
    decideAction(ctx) {
      if (!ctx.engine) {
        return { kind: "stuck", reason: "monte-carlo: requires ctx.engine" };
      }

      const candidates = enumerateCandidateActions(ctx.prompt);
      if (candidates.length === 0) return { kind: "stuck", reason: "no actionable moves" };
      if (candidates.length === 1) return candidates[0]!;

      let bestDecision = candidates[0]!;
      let bestScore = Number.NEGATIVE_INFINITY;

      for (const decision of candidates) {
        const score = evaluateAction(
          ctx.engine,
          decision,
          ctx.playerId,
          rolloutsPerAction,
          maxRolloutSteps,
          rolloutStrategy,
          ctx.rng,
        );
        if (score > bestScore) {
          bestScore = score;
          bestDecision = decision;
        }
      }
      return bestDecision;
    },
  };
}

/** Default Monte Carlo: random rollouts. Fast but noisy. */
export const monteCarloStrategy: AIStrategy = createMonteCarloStrategy();

/**
 * Stronger Monte Carlo variant: rollouts use `greedyStrategy` for both
 * sides instead of random. Each rollout is more expensive (greedy walks
 * the filtered view per decision) but the win-rate signal is much
 * sharper because plausible play replaces noise. Recommended for
 * balance / playtest runs where decision count is modest.
 */
export const monteCarloGreedyStrategy: AIStrategy = createMonteCarloStrategy({
  rolloutStrategy: greedyStrategy,
});

function evaluateAction(
  engine: EngineHandle,
  action: MoveDecision & { kind: "command" },
  playerId: PlayerId,
  rollouts: number,
  maxSteps: number,
  rolloutStrategy: AIStrategy,
  rng: () => number,
): number {
  const probe = engine.fork();
  const command: CommandEnvelope = {
    commandID: `mc-probe-${rng()}`,
    move: action.move,
    input: action.args ? { args: action.args } : undefined,
  };
  const result = probe.processCommand(command, playerId);
  if (!result.success) return Number.NEGATIVE_INFINITY;
  let wins = 0;
  for (let i = 0; i < rollouts; i++) {
    const sim = probe.fork();
    const winner = runRollout(sim, playerId, rolloutStrategy, rng, maxSteps);
    if (winner === playerId) wins += 1;
    else if (winner === null) wins += 0.5;
  }
  return wins / Math.max(1, rollouts);
}
