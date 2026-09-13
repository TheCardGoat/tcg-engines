import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessMagisterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { restlessClericRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { cintariSellsword } from "@tcg/flesh-and-blood-cards/cards/tokens/cintari-sellsword";
import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const DECAY_SCENARIOS: FabScenarioCollection = {
  "decay-ability": {
    id: "decay-ability",
    label: "Decay — end-phase counters and ally death",
    description:
      "End your turn: your Restless Magister and Restless Cleric each gain a −1 life counter. Cintari Sellsword is unchanged. The opposing Magister decays only on its controller’s turn. Repeat through three of your end phases to see your three-life Magister destroyed and put in your graveyard. Hero life stays unchanged.",
    group: "edge",
    tags: ["decay", "IAR", "ally", "counters", "end-phase"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(bravo),
          arena: [
            previewCard(restlessMagisterRed),
            previewCard(restlessClericRed),
            previewCard(cintariSellsword),
          ],
          hand: [],
          deck: [],
          intellect: 0,
          life: 20,
        },
        {
          hero: previewCard(dash),
          arena: [previewCard(restlessMagisterRed)],
          hand: [],
          deck: [],
          intellect: 0,
          life: 20,
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      return matchFromEngine(engine, "decay-ability");
    },
  },
};
