import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * <High-Maneuver> keyword fixture — viewer has a HighManeuver attacker
 * AND the opponent has an active (non-rested) unit on the board.
 * Normally that active unit would block the direct-attack path
 * (rule 8-1-3: direct attack legal only when opponent has no units in
 * play), but High-Maneuver overrides that restriction (rule 8-1-4 +
 * 13-1-6). The distinguishing UI signal: the attack overlay opens and
 * exposes the DIRECT attack button even with enemies on the board.
 *
 * Without the keyword, `listLegalAttackTargets` would return [] for
 * this attacker (no rested enemy targets, direct blocked by the active
 * enemy), so the engine would drop it from attacker candidates and
 * clicking it would start nothing.
 *
 * Shield math: opponent starts with no pre-seeded shields in the
 * fixture, so the engine's setup-time shield fill determines how many
 * are present when the direct hit lands. We assert on the direct-path
 * being reachable rather than on specific shield destruction.
 */
export function loadHighManeuverDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [
        createMockUnit({
          cost: 3,
          level: 3,
          ap: 3,
          hp: 4,
          color: "blue",
          name: "Gundam HM",
          keywordEffects: [{ keyword: "HighManeuver" }],
        }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        // Active (NOT exhausted) — blocks the direct-attack path for a
        // non-HighManeuver attacker. The engine also won't expose this
        // unit as a legal unit-target (rule 8-1-3 requires rested).
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
