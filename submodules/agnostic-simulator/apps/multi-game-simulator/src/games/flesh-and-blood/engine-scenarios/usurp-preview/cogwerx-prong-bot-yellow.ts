import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/cogwerx-prong-bot.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { cogwerxProngBotYellow as cogwerxProngBotYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/cogwerx-prong-bot";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const cogwerxProngBotYellow = previewCard(cogwerxProngBotYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-cogwerx-prong-bot-yellow",
  label: "Cogwerx Prong Bot (yellow)",
  description:
    "happy: paying {r} and discarding this from hand creates a Golden Cog. When this hits a hero, you may put a steam counter on an item you control with crank.\nInstant - {r}, discard this: Create a Golden Cog token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "cogwerx-prong-bot-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxProngBotYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    Dash.activate(cogwerxProngBotYellow);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-cogwerx-prong-bot-yellow");
  },
};
