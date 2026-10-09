import type { EffectBlockContinuation, MatchState } from "../types.ts";

type TriggerEvent = NonNullable<EffectBlockContinuation["triggerEvent"]>;
// Only the synchronous executor is ambient. Queue items and prompts carry the
// event across choices and JSON snapshots; a new effect block supplies its own.
const executing = new WeakMap<MatchState, TriggerEvent>();
export function currentEffectTriggerEvent(state: MatchState) {
  return executing.get(state);
}
export function withEffectTriggerEvent<T>(
  state: MatchState,
  event: TriggerEvent | undefined,
  run: () => T,
): T {
  const previous = executing.get(state);
  if (event) executing.set(state, event);
  else executing.delete(state);
  try {
    return run();
  } finally {
    if (previous) executing.set(state, previous);
    else executing.delete(state);
  }
}
