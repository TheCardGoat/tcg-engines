import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow as allyRules } from "@tcg/flesh-and-blood-cards/cards/actions/limpit-hop-a-long";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { markOfUsheringBlue as markRules } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-ushering";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const limpitHopALongYellow = previewCard(allyRules);
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);
const markOfUsheringBlue = previewCard(markRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-mark-of-ushering-blue",
  label: "Mark of Ushering (blue)",
  description:
    "Mark of Ushering is bound beneath Limpit Hop-a-Long, granting +1 power. Attack and hit to create Gate to i'Arathael; the same rider also applies when the Ally dies.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "mark-of-ushering-blue", "aura", "ally", "bind", "gate-to-i-arathael"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [markOfUsheringBlue],
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(dash);
    player.play(markOfUsheringBlue, {
      targetInstanceId: player.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-mark-of-ushering-blue");
  },
};
