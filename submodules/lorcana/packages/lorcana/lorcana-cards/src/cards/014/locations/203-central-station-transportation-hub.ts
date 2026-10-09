import type { LocationCard } from "@tcg/lorcana-types";
import { centralStationTransportationHubI18n } from "./203-central-station-transportation-hub.i18n";

export const centralStationTransportationHub: LocationCard = {
  id: "AUI",
  canonicalId: "ci_AUI",
  slug: "lorcana-ci_AUI",
  printings: [
    {
      id: "set14-203",
      artId: "set14-203",
      setCode: "set14",
      collectorNumber: "203",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-203"],
  cardType: "location",
  name: "Central Station",
  version: "Transportation Hub",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 203,
  rarity: "common",
  cost: 1,
  willpower: 2,
  moveCost: 1,
  lore: 0,
  inkable: true,
  text: [
    {
      title: "Free Souvenir",
      description:
        "Once during your turn, whenever a character moves here, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  abilities: [
    {
      id: "AUI-1",
      name: "Free Souvenir",
      text: "Free Souvenir Once during your turn, whenever a character moves here, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      type: "triggered",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hyperia City"],
  i18n: centralStationTransportationHubI18n,
};
