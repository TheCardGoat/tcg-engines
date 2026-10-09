import type { LocationCard } from "@tcg/lorcana-types";
import { portAuthorityCenterHubI18n } from "./034-port-authority-center-hub.i18n";

export const portAuthorityCenterHub: LocationCard = {
  id: "iKo",
  canonicalId: "ci_iKo",
  slug: "lorcana-ci_iKo",
  printings: [
    {
      id: "set14-034",
      artId: "set14-034",
      setCode: "set14",
      collectorNumber: "34",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-034"],
  cardType: "location",
  name: "Port Authority",
  version: "Center Hub",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 34,
  rarity: "uncommon",
  cost: 4,
  willpower: 8,
  moveCost: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4829c0432f0642cdb297b45a9de0ee60",
  },
  text: [
    {
      title: "WELCOME TO TOWN",
      description:
        "Once during your turn, whenever a character moves here, each player gets 1 ink drop and gains 1 lore. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  abilities: [
    {
      id: "iKo-1",
      name: "WELCOME TO TOWN",
      text: "WELCOME TO TOWN Once during your turn, whenever a character moves here, each player gets 1 ink drop and gains 1 lore. (Each ink drop may be removed to pay 1 {I}.)",
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
        type: "sequence",
        steps: [
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "EACH_PLAYER",
          },
          {
            type: "gain-lore",
            amount: 1,
            target: "EACH_PLAYER",
          },
        ],
      },
    },
  ],
  classifications: ["Hyperia City"],
  i18n: portAuthorityCenterHubI18n,
};
