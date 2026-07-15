import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachStrategyBot } from "../bot/strategy-bot.ts";

/**
 * vs-AI demo fixture — opens a match where the viewer is player_one and
 * player_two is driven by the greedy-legal bot. Both sides start mid-
 * game with enough material that the first few turns produce visible
 * actions (deploys, attacks, passes) rather than degenerate empty
 * boards that end in immediate `passTurn` cycles.
 *
 * Shape:
 *   - Viewer: 3-card hand, 3 resources, 1 unit on board (Guncannon).
 *   - Opponent: 2-card hand, 2 resources, 1 rested unit on board (Dom).
 *
 * `skipToMainPhase: true` seats us in turn-1 main-phase so the viewer
 * can act immediately. The bot attaches in auto mode with balanced
 * speed — the first time the engine flips `activePlayer` to player_two,
 * the bot's `onStateUpdate` schedule fires.
 *
 * Distinct from `battle-ready-demo` (which uses `attachAutoPassBot`
 * for a pass-only opponent) — here the opponent plays a real game.
 */
export function loadVsAiDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "RX-78-2" }),
        createMockUnit({ cost: 2, level: 2, ap: 3, hp: 4, color: "red", name: "Zaku II" }),
        createMockUnit({ cost: 3, level: 3, ap: 4, hp: 5, color: "green", name: "Gundam GP01" }),
      ],
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "white", name: "Guncannon" }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      hand: [
        createMockUnit({ cost: 1, level: 1, ap: 1, hp: 2, color: "purple", name: "Char's Zaku" }),
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Gouf" }),
      ],
      battleArea: [
        {
          card: createMockUnit({ cost: 3, level: 3, ap: 3, hp: 5, color: "purple", name: "Dom" }),
          // Rested so Guncannon can actually attack it if the viewer
          // picks that line.
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Greedy-legal bot on player_two. The bot subscribes to
  // `onStateUpdate` and submits through the runtime directly — same
  // pattern as `attachAutoPassBot` but now plays real actions via the
  // engine's candidate planner. Returned on `dev.bot` so App-level
  // wiring can mount control-panel UI bound to this handle.
  const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);

  return { ...dev, bot };
}
