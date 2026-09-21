import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { blisteringBladeRed } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/blistering-blade";
import { scarTissueRed } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/scar-tissue";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { fang } from "@tcg/flesh-and-blood-cards/cards/heroes/fang";
import { obsidianFireVein } from "@tcg/flesh-and-blood-cards/cards/weapons/obsidian-fire-vein";

import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

export const MARKED_HERO_SCENARIOS = {
  "marked-hero-signal": {
    id: "marked-hero-signal",
    label: "Marked hero — signal and logs",
    description:
      "Obsidian Fire Vein boosted by Scar Tissue (+3 and mark-on-hit) and Blistering Blade (+2) hits the defending hero for 6 and marks them (CR 9.3). Validates the marked pip on the opponent hero, the signal popover, and the 'Obsidian Fire Vein marked Opponent' log line.",
    group: "combat",
    tags: ["combat", "marked", "hero-signal", "scar-tissue", "logs", "cr-9.3"],
    viewerId: "player-1",
    botMode: "off",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(fang),
          weapon1: [previewCard(obsidianFireVein)],
          hand: [previewCard(scarTissueRed), previewCard(blisteringBladeRed)],
          resourcePoints: 4,
          actionPoints: 1,
          deck: 6,
        },
        { hero: previewCard(dash), hand: [], life: 20, deck: 6 },
        MANUAL,
      );
      const Fang = engine.as(fang);

      Fang.must.activate(obsidianFireVein);
      engine.advanceCombatTo("reaction");
      Fang.must.playReaction(scarTissueRed);
      Fang.must.playReaction(blisteringBladeRed);
      engine.passBoth();
      engine.helpers.resolveRestOfCombat();

      return matchFromEngine(engine, "marked-hero-signal");
    },
  },
} satisfies FabScenarioCollection;
