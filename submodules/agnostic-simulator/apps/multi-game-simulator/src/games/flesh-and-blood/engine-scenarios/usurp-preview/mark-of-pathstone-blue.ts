import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow as allyRules } from "@tcg/flesh-and-blood-cards/cards/actions/limpit-hop-a-long";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { markOfPathstoneBlue as markRules } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-pathstone";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const limpitHopALongYellow = previewCard(allyRules);
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);
const markOfPathstoneBlue = previewCard(markRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-mark-of-pathstone-blue",
  label: "Mark of Pathstone (blue)",
  description:
    "Mark of Pathstone is bound beneath Limpit Hop-a-Long, granting +1 power. Attack and hit to gain 1 life; the same rider also applies when the Ally dies.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "mark-of-pathstone-blue", "aura", "ally", "bind", "gain-life"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [markOfPathstoneBlue],
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(dash);
    player.play(markOfPathstoneBlue, {
      targetInstanceId: player.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-mark-of-pathstone-blue");
  },
};
