export const inspection: unknown[] = [];
import { applyCommand } from "../../../../../../../../../alpha-clash/packages/engine/src/commands.ts";
import type {
  AcCommand,
  MatchState,
  PlayerId,
} from "../../../../../../../../../alpha-clash/packages/engine/src/types.ts";
import { alphaClashExpertCandidates, alphaClashPaymentVariants } from "./candidates.ts";
import { evaluateAlphaClash } from "./evaluate.ts";
import { alphaClashSearchActor, alphaClashSearchKey, forkAlphaClashState } from "./search-state.ts";

export interface AlphaClashExpertOptions {
  maxNodes?: number;
  beamWidth?: number;
  depthLimit?: number;
  replyLines?: number;
}
export interface AlphaClashExpertDecision {
  command: AcCommand | null;
  diagnostics: {
    nodesEvaluated: number;
    candidateCount: number;
    depthReached: number;
    cyclesAvoided: number;
    score: number;
    budgetExhausted: number;
  };
}
interface Edge {
  command: AcCommand;
  state: MatchState;
  key: string;
}
interface Line {
  state: MatchState;
  first: AcCommand;
  score: number;
  seen: Set<string>;
  depth: number;
}

/** Each card/action gets a turn before another target variant of that card/action. */
function fairCandidates(commands: AcCommand[]): AcCommand[] {
  const groups = new Map<string, AcCommand[]>();
  for (const command of commands) {
    const family = `${command.type}/${"cardId" in command ? command.cardId : ""}`;
    const group = groups.get(family) ?? [];
    group.push(command);
    groups.set(family, group);
  }
  const result: AcCommand[] = [];
  for (let n = 0; [...groups.values()].some((group) => n < group.length); n++)
    for (const group of groups.values()) if (group[n]) result.push(group[n]);
  return result;
}

/** Own one instance per match. Private information is an intentional policy input. */
export function createAlphaClashExpert(options: AlphaClashExpertOptions = {}) {
  const positive = (value: number | undefined, fallback: number) => {
    if (value === undefined) return fallback;
    if (!Number.isFinite(value) || value < 1)
      throw new Error("Expert search limits must be positive finite numbers");
    return Math.floor(value);
  };
  const maxNodes = positive(options.maxNodes, 768);
  const width = positive(options.beamWidth, 5);
  const depthLimit = positive(options.depthLimit, 12);
  const replyLines = positive(options.replyLines, 4);
  const histories = new Map<PlayerId, { scope: string; revision: number; keys: Set<string> }>();
  return {
    decide(state: MatchState, seat: PlayerId): AlphaClashExpertDecision {
      let nodes = 0,
        deepest = 0,
        cycles = 0;
      const planningLimit = Math.max(1, Math.floor(maxNodes * 0.75));
      const cache = new WeakMap<MatchState, Edge[]>();
      const scores = new WeakMap<MatchState, number>();
      const score = (position: MatchState) => {
        let value = scores.get(position);
        if (value === undefined) {
          value = evaluateAlphaClash(position, seat);
          scores.set(position, value);
        }
        return value;
      };
      const scope = `${state.id}/${state.turnNumber}/${state.activePlayer}`;
      let history = histories.get(seat);
      if (!history || history.scope !== scope || (state.stateID ?? 0) < history.revision) {
        history = { scope, revision: state.stateID ?? 0, keys: new Set() };
        histories.set(seat, history);
      }
      history.revision = state.stateID ?? 0;
      history.keys.add(alphaClashSearchKey(state));
      const children = (from: MatchState, limit: number): Edge[] => {
        const saved = cache.get(from);
        if (saved) return saved;
        const actor = alphaClashSearchActor(from);
        if (!actor) return [];
        const commands = fairCandidates(alphaClashExpertCandidates(from, actor));
        const edges: Edge[] = [],
          seen = new Set<string>();
        let tried = 0;
        for (const command of commands) {
          if (nodes >= limit || tried >= 96 || edges.length >= 24) break;
          nodes++;
          tried++;
          const result = applyCommand(forkAlphaClashState(from), command);
          if (!result.success) continue;
          commands.push(...alphaClashPaymentVariants(from, command, result.state));
          // Native batch choices can return a replacement state.
          const key = alphaClashSearchKey(result.state);
          if (seen.has(key)) continue;
          seen.add(key);
          edges.push({ command, state: result.state, key });
        }
        // Only a fully enumerated list can establish that an action is forced.
        if (tried === commands.length) cache.set(from, edges);
        return edges;
      };
      const boundary = (position: MatchState) =>
        position.phase.name === "complete" ||
        position.turnNumber !== state.turnNumber ||
        position.activePlayer !== state.activePlayer;
      const forced = (
        position: MatchState,
        limit: number,
        seen: ReadonlySet<string>,
      ): MatchState => {
        const visited = new Set(seen);
        for (let step = 0; step < 20 && nodes < limit && !boundary(position); step++) {
          const next = children(position, limit);
          if (next.length !== 1 || !cache.has(position)) break;
          const edge = next[0];
          if (visited.has(edge.key)) {
            cycles++;
            break;
          }
          visited.add(edge.key);
          position = edge.state;
        }
        return position;
      };
      const reply = (
        from: MatchState,
        limit: number,
        seen: ReadonlySet<string>,
      ): MatchState | undefined => {
        const actor = alphaClashSearchActor(from);
        const choices = children(from, limit).filter((edge) => !seen.has(edge.key));
        let best: MatchState | undefined,
          bestScore = -Infinity;
        for (let index = 0; index < choices.length; index++) {
          const allowance = nodes + Math.floor((limit - nodes) / (choices.length - index));
          const child = forced(choices[index].state, allowance, seen);
          const value = score(child) * (actor === seat ? 1 : -1);
          if (value > bestScore) {
            best = child;
            bestScore = value;
          }
        }
        return best;
      };
      const advance = (line: Line, limit: number): Line | undefined => {
        let position = line.state;
        const seen = new Set(line.seen);
        for (let n = 0; n < 32; n++) {
          const key = alphaClashSearchKey(position);
          if (seen.has(key)) {
            cycles++;
            return undefined;
          }
          seen.add(key);
          if (boundary(position)) return { ...line, state: position, seen, score: score(position) };
          const actor = alphaClashSearchActor(position);
          if (!actor || actor === seat) {
            const settled = forced(position, limit, seen);
            if (settled !== position) {
              position = settled;
              continue;
            }
            return { ...line, state: position, seen, score: score(position) };
          }
          const next = reply(position, limit, seen);
          if (!next) return { ...line, state: position, seen, score: score(position) };
          position = next;
        }
        return { ...line, state: position, seen, score: score(position) };
      };
      const rank = (lines: Line[], count: number) =>
        lines.sort((a, b) => b.score - a.score || a.depth - b.depth).slice(0, count);
      const roots = alphaClashSearchActor(state) === seat ? children(state, planningLimit) : [];
      inspection.push({
        stage: "roots",
        nodes,
        roots: roots.map((e) => ({ command: e.command, state: e.state, score: score(e.state) })),
      });
      if (roots.length === 1 && cache.has(state) && !history.keys.has(roots[0].key))
        return {
          command: roots[0].command,
          diagnostics: {
            nodesEvaluated: nodes,
            candidateCount: 1,
            depthReached: 1,
            cyclesAvoided: 0,
            score: score(roots[0].state),
            budgetExhausted: Number(nodes >= maxNodes),
          },
        };
      let frontier: Line[] = [];
      const finished: Line[] = [];
      for (let i = 0; i < roots.length; i++) {
        const edge = roots[i];
        const limit = nodes + Math.floor((planningLimit - nodes) / (roots.length - i));
        const line = advance(
          {
            state: edge.state,
            first: edge.command,
            score: 0,
            seen: new Set(history.keys),
            depth: 1,
          },
          limit,
        );
        if (line) (boundary(line.state) ? finished : frontier).push(line);
      }
      for (let depth = 1; depth < depthLimit && frontier.length && nodes < planningLimit; depth++) {
        const next: Line[] = [];
        const parents = rank(frontier, width);
        for (let i = 0; i < parents.length; i++) {
          const line = parents[i];
          if (alphaClashSearchActor(line.state) !== seat) continue;
          const limit = nodes + Math.floor((planningLimit - nodes) / (parents.length - i));
          for (const edge of children(line.state, limit)) {
            const child = advance({ ...line, state: edge.state, depth: depth + 1 }, limit);
            if (child) (boundary(child.state) ? finished : next).push(child);
          }
        }
        deepest = depth + 1;
        if (!next.length) break;
        frontier = next;
      }
      // Compare distinct first actions, not several variants of the same first move.
      const finalists: Line[] = [],
        firstActions = new Set<string>();
      for (const line of rank([...finished, ...frontier], Number.MAX_SAFE_INTEGER)) {
        const key = JSON.stringify(line.first);
        if (firstActions.has(key)) continue;
        firstActions.add(key);
        finalists.push(line);
        if (finalists.length >= replyLines) break;
      }
      inspection.push({ stage: "planned", nodes, lines: finalists.map((l) => ({ ...l })) });
      for (let i = 0; i < finalists.length; i++) {
        const line = finalists[i];
        const limit = nodes + Math.floor((maxNodes - nodes) / (finalists.length - i));
        let position = line.state;
        const seen = new Set(line.seen);
        for (let step = 0; step < 24 && nodes < limit; step++) {
          const actor = alphaClashSearchActor(position);
          if (!actor || (boundary(position) && actor === seat && position.activePlayer === seat))
            break;
          const next = reply(position, limit, seen);
          if (!next) break;
          position = next;
          seen.add(alphaClashSearchKey(position));
        }
        line.score = score(position);
      }
      inspection.push({ stage: "replies", nodes, lines: finalists });
      const best = rank(finalists, 1)[0];
      const fallback = roots.find((edge) => !history.keys.has(edge.key));
      return {
        command: best?.first ?? fallback?.command ?? null,
        diagnostics: {
          nodesEvaluated: nodes,
          candidateCount: roots.length,
          depthReached: Math.max(roots.length ? 1 : 0, deepest),
          cyclesAvoided: cycles,
          score: best?.score ?? score(state),
          budgetExhausted: Number(nodes >= maxNodes),
        },
      };
    },
  };
}
