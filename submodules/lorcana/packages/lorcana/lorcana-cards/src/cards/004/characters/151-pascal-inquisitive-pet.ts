import type { CharacterCard } from "@tcg/lorcana-types";
import { pascalInquisitivePetI18n } from "./151-pascal-inquisitive-pet.i18n";

export const pascalInquisitivePet: CharacterCard = {
  id: "5d3",
  canonicalId: "ci_5d3",
  reprints: ["set4-151"],
  cardType: "character",
  name: "Pascal",
  version: "Inquisitive Pet",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 151,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_551090cbc3134b44b9736a0fd5320b3a",
    tcgPlayer: 550520,
  },
  text: [
    {
      title: "COLORFUL TACTICS",
      description:
        "When you play this character, look at the top 3 cards of your deck and put them back in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 3,
        destinations: [
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-top",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "f7s-1",
      name: "COLORFUL TACTICS",
      text: "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: pascalInquisitivePetI18n,
};
