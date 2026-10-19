// Owns cloned planning and validated command transport, not card-behavior coverage.
import { expect, test } from "vite-plus/test";
import {
  createInitialState,
  chooseAiAction,
  deciderOf,
  applyAction,
} from "@tcg-engines/naruto-engine";
import { decideNarutoBot } from "./bot-decision";

test("Naruto cloned snapshots retain the same greedy choices over successive decisions", () => {
  let state = createInitialState({ seed: 42 });
  let actions = 0;
  for (let step = 0; step < 20 && !state.winner; step++) {
    const player = deciderOf(state);
    if (!player) break;
    const expected = chooseAiAction(state, player);
    const planned = decideNarutoBot(
      structuredClone({ state, player, strategy: "greedy" as const }),
    );
    expect(planned.action).toEqual(expected);
    if (!expected) break;
    const next = applyAction(state, expected);
    if (next === state) break;
    state = next;
    actions++;
  }
  expect(actions).toBeGreaterThan(5);
});
