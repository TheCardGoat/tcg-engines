import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxLabAssistantI18n } from "./085-baymax-lab-assistant.i18n";

export const baymaxLabAssistant: CharacterCard = {
  id: "Mq1",
  canonicalId: "ci_Mq1",
  slug: "lorcana-ci_Mq1",
  printings: [
    {
      id: "set14-085",
      artId: "set14-085",
      setCode: "set14",
      collectorNumber: "85",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-085"],
  cardType: "character",
  name: "Baymax",
  version: "Lab Assistant",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 85,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_532b770c7fa9416384f1f413b08a4bd0",
  },
  text: [
    {
      title: "RESUPPLY",
      description:
        "When you play this character, if you have 2 or more items in play, get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Robot"],
  abilities: [
    {
      id: "Mq1-1",
      name: "RESUPPLY",
      type: "triggered",
      text: "RESUPPLY When you play this character, if you have 2 or more items in play, get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-item-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 2,
      },
      effect: {
        type: "gain-ink-drop",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: baymaxLabAssistantI18n,
};
