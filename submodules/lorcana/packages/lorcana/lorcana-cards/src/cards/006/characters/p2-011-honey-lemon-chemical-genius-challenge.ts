import type { CharacterCard } from "@tcg/lorcana-types";
import { honeyLemonChemicalGeniusP2ChallengeI18n } from "./p2-011-honey-lemon-chemical-genius-challenge.i18n";

export const honeyLemonChemicalGeniusP2Challenge: CharacterCard = {
  id: "wh6",
  canonicalId: "ci_Fwb",
  slug: "lorcana-ci_Fwb",
  printings: [
    {
      id: "set6-p2-011-challenge",
      artId: "ci_Fwb-challenge",
      setCode: "set6",
      collectorNumber: "11",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set6-074"],
  cardType: "character",
  name: "Honey Lemon",
  version: "Chemical Genius",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 11,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f20b9f97af684d8e84eb6b017eabd8d5",
    tcgPlayer: "578178",
  },
  text: [
    {
      title: "HERE'S THE BEST PART",
      description:
        "When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "EACH_OPPONENT",
          type: "discard",
        },
        type: "optional",
      },
      id: "q86-1",
      name: "HERE'S THE BEST PART",
      text: "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: honeyLemonChemicalGeniusP2ChallengeI18n,
};
