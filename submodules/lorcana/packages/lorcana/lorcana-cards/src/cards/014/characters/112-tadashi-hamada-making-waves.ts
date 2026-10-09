import type { CharacterCard } from "@tcg/lorcana-types";
import { tadashiHamadaMakingWavesI18n } from "./112-tadashi-hamada-making-waves.i18n";

export const tadashiHamadaMakingWaves: CharacterCard = {
  id: "Qbi",
  canonicalId: "ci_Qbi",
  slug: "lorcana-ci_Qbi",
  printings: [
    {
      id: "set14-112",
      artId: "set14-112",
      setCode: "set14",
      collectorNumber: "112",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-112"],
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Making Waves",
  inkType: ["ruby"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 112,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 3,
  inkable: true,
  text: [
    {
      title: "Urgent Delivery",
      description:
        "When this character is banished, get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
  abilities: [
    {
      id: "Qbi-1",
      name: "Urgent Delivery",
      type: "triggered",
      text: "Urgent Delivery When this character is banished, get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: tadashiHamadaMakingWavesI18n,
};
