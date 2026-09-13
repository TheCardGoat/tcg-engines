import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/attack-reactions/fresh-from-the-forge.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { fang as fangRules } from "@tcg/flesh-and-blood-cards/cards/heroes/fang";
import { obsidianFireVein as obsidianFireVeinRules } from "@tcg/flesh-and-blood-cards/cards/weapons/obsidian-fire-vein";
import { freshFromTheForgeRed as freshFromTheForgeRedRules } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/fresh-from-the-forge";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const fang = previewCard(fangRules);
const obsidianFireVein = previewCard(obsidianFireVeinRules);
const freshFromTheForgeRed = previewCard(freshFromTheForgeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-fresh-from-the-forge-red",
  label: "Fresh from the Forge (red)",
  description:
    "Sharpen each dagger you control. The next time a dagger you control hits a hero this turn, you may remove a +1{p} counter from it. If you do, mark them. Pass to hit, then accept the optional to mark.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "fresh-from-the-forge-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        weapon2: [obsidianFireVein],
        hand: [freshFromTheForgeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Fang = engine.as(fang);
    const attacking = Fang.cardIn("weapon1", obsidianFireVein);
    Fang.must.activate(attacking);
    engine.toReaction("attacker");
    Fang.must.playReaction(freshFromTheForgeRed);
    return matchFromEngine(engine, "usurp-preview-fresh-from-the-forge-red");
  },
};
