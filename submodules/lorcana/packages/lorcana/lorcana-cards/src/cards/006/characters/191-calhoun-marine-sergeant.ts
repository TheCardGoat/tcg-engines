import type { CharacterCard } from "@tcg/lorcana-types";
import { calhounMarineSergeantI18n } from "./191-calhoun-marine-sergeant.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const calhounMarineSergeant: CharacterCard = {
  id: "NLA",
  canonicalId: "ci_NLA",
  reprints: ["set6-191"],
  cardType: "character",
  name: "Calhoun",
  version: "Marine Sergeant",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 191,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_f6c83c36dbe04bdcb19ee7bd9d0479cd",
    tcgPlayer: 592017,
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "LEVEL UP",
      description:
        "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    resist(1),
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "10g-2",
      name: "LEVEL UP",
      text: "LEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: calhounMarineSergeantI18n,
};
