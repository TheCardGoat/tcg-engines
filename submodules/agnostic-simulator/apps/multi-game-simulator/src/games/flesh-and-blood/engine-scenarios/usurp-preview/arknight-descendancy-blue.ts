import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/arknight-descendancy.test.ts.
import { FabTestEngine, fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { arknightDescendancyBlue as arknightDescendancyBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/arknight-descendancy";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const viserai = previewCard(viseraiRules);
const dash = previewCard(dashRules);
const arknightDescendancyBlue = previewCard(arknightDescendancyBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-arknight-descendancy-blue",
  label: "Arknight Descendancy (blue)",
  description:
    "happy: each controlled Runechant reduces the play cost by {r}. Viserai Specialization\nThis costs {r} less to play for each Runechant you control.\nWhen this is banished from anywhere, you may pay up to 3{h}. Create that many Runechant tokens.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "arknight-descendancy-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arknightDescendancyBlue],
        arena: [
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
        ],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    game.as(viserai).attackWith(arknightDescendancyBlue);
    return matchFromEngine(engine, "usurp-preview-arknight-descendancy-blue");
  },
};
