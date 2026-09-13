import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue as nimblismRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { restlessLooterRed as looterRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";
import { snatchRed as snatchRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const nimblismBlue = previewCard(nimblismRules);
const restlessLooterRed = previewCard(looterRules);
const snatchRed = previewCard(snatchRules);
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-looter-red",
  label: "Restless Looter (red)",
  description:
    "Restless Looter has paid its Instant cost: it is tapped, the selected card was discarded, and a replacement card was drawn.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-looter-red", "ally", "instant", "discard", "draw"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessLooterRed],
        hand: [nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(malice);
    player.activate(restlessLooterRed);
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-restless-looter-red");
  },
};
