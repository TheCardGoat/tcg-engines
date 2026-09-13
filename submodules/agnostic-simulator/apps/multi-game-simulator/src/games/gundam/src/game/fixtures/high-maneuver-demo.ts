import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import {
  gd01WingGundamZero024,
  realResourceCards,
  realShieldCards,
  st01DemiTrainer008,
} from "./real-cards.ts";

/**
 * <High-Maneuver> keyword fixture — viewer has Wing Gundam Zero and the
 * opponent has a ready Demi Trainer with <Blocker>. The distinguishing
 * interaction is that the direct attack proceeds without offering the
 * otherwise legal Blocker.
 *
 * Shields keep the first direct hit from ending the match, leaving the
 * board visible for keyword QA.
 */
export function loadHighManeuverDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [gd01WingGundamZero024],
      resourceArea: realResourceCards(3),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [st01DemiTrainer008],
      shieldArea: realShieldCards(2),
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
