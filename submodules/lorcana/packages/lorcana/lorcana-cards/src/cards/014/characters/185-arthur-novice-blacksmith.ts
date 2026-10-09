import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurNoviceBlacksmithI18n } from "./185-arthur-novice-blacksmith.i18n";

export const arthurNoviceBlacksmith: CharacterCard = {
  id: "ctj",
  canonicalId: "ci_ctj",
  slug: "lorcana-ci_ctj",
  printings: [
    {
      id: "set14-185",
      artId: "set14-185",
      setCode: "set14",
      collectorNumber: "185",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-185"],
  cardType: "character",
  name: "Arthur",
  version: "Novice Blacksmith",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 185,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_30a89e2abb7c478ca77cf79c66c4ee16",
  },
  text: [
    {
      title: "CAREFUL CRAFTING",
      description:
        "When you play this character, you may pay 1 {I} to get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "arthur-novice-1",
      name: "CAREFUL CRAFTING",
      type: "triggered",
      text: "CAREFUL CRAFTING When you play this character, you may pay 1 {I} to get 1 ink drop.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    },
  ],
  i18n: arthurNoviceBlacksmithI18n,
};
