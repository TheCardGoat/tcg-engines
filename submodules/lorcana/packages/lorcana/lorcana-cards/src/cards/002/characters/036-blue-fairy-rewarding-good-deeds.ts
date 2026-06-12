import type { CharacterCard } from "@tcg/lorcana-types";
import { blueFairyRewardingGoodDeedsI18n } from "./036-blue-fairy-rewarding-good-deeds.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const blueFairyRewardingGoodDeeds: CharacterCard = {
  id: "llN",
  canonicalId: "ci_llN",
  reprints: ["set2-036"],
  cardType: "character",
  name: "Blue Fairy",
  version: "Rewarding Good Deeds",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 36,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fde84e341b0c47929fba2503d3141e45",
    tcgPlayer: 527542,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "ETHEREAL GLOW",
      description: "Whenever you play a Floodborn character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    evasive,
    {
      id: "tv6-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "ETHEREAL GLOW",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
      text: "ETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
    },
  ],
  i18n: blueFairyRewardingGoodDeedsI18n,
};
