import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow as allyRules } from "@tcg/flesh-and-blood-cards/cards/actions/limpit-hop-a-long";
import { snatchRed as snatchRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { markOfNeverestBlue as markRules } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-neverest";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const limpitHopALongYellow = previewCard(allyRules);
const snatchRed = previewCard(snatchRules);
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);
const markOfNeverestBlue = previewCard(markRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-mark-of-neverest-blue",
  label: "Mark of Neverest (blue)",
  description:
    "Mark of Neverest is bound beneath Limpit Hop-a-Long, granting +1 power. Attack and hit to turn the banished card face-down and create Corrupted Corpse.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "mark-of-neverest-blue", "aura", "ally", "bind", "banished"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [markOfNeverestBlue],
        banished: [snatchRed],
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(dash);
    player.play(markOfNeverestBlue, {
      targetInstanceId: player.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-mark-of-neverest-blue");
  },
};
