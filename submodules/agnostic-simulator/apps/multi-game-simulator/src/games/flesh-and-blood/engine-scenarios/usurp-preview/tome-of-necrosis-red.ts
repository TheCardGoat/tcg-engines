import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { restlessClericRed as clericRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { restlessLooterRed as looterRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";
import { snatchRed as snatchRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { tomeOfNecrosisRed as tomeRules } from "@tcg/flesh-and-blood-cards/cards/actions/tome-of-necrosis";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const restlessClericRed = previewCard(clericRules);
const restlessLooterRed = previewCard(looterRules);
const snatchRed = previewCard(snatchRules);
const tomeOfNecrosisRed = previewCard(tomeRules);
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-tome-of-necrosis-red",
  label: "Tome of Necrosis (red)",
  description:
    "Paused at Tome of Necrosis's alternative cost. Choose either the Ally in hand to discard or the Ally in the arena to destroy, then inspect the draw and hero untap.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "tome-of-necrosis-red", "alternative-cost", "ally", "draw", "untap"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [tomeOfNecrosisRed, restlessLooterRed],
        arena: [restlessClericRed],
        deckTop: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(malice);
    engine.playInstance(
      player.id,
      player.cardIn("hand", tomeOfNecrosisRed).instanceId,
      {},
      "explicit",
    );
    return matchFromEngine(engine, "usurp-preview-tome-of-necrosis-red");
  },
};
