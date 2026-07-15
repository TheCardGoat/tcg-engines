import { createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * 【Attack】 trigger fixture — viewer's attacker has an 【Attack】 Draw 1
 * effect. Declaring an attack should fire the trigger (rule 8-2-2) and
 * put 1 card into the viewer's hand. Mirrors the trigger shape in
 * `packages/engine/src/gundam/moves/core/pilot-trigger-routing.test.ts`
 * (`pilotAttackDraw`), but with the effect printed on a UNIT rather
 * than on a pilot — the routing rule differs but the draw-on-attack
 * observable is the same.
 */
function makeAttackDrawUnit(): UnitCard {
  const attackDraw: CardEffect = {
    type: "triggered",
    activation: { timing: ["attack"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Attack】 Draw 1.",
  };
  return createMockUnit({
    cost: 2,
    level: 2,
    ap: 2,
    hp: 4,
    color: "blue",
    name: "Recon Gundam",
    effects: [attackDraw],
  });
}

export function loadAttackTriggerDrawDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [makeAttackDrawUnit()],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Dom" }),
          // Rested so it registers as a legal unit-target per rule
          // 8-1-3 (see `listLegalAttackTargets`). Non-rested would
          // force a direct-attack path which changes the damage
          // shape — we want a clean unit-vs-unit attack so the
          // 【Attack】 draw is the only variable.
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
