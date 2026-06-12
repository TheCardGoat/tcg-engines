import type { CharacterCard } from "@tcg/lorcana-types";
import { scarViciousCheaterI18n } from "./125-scar-vicious-cheater.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const scarViciousCheater: CharacterCard = {
  id: "U8O",
  canonicalId: "ci_U8O",
  reprints: ["set2-125"],
  cardType: "character",
  name: "Scar",
  version: "Vicious Cheater",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "002",
  cardNumber: 125,
  rarity: "legendary",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_02f5f28e11b84721906692f042d0baee",
    tcgPlayer: 523760,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "DADDY ISN'T HERE TO SAVE YOU",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    rush,
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              target: "SELF",
              type: "ready",
            },
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
      },
      id: "1re-2",
      name: "DADDY ISN'T HERE TO SAVE YOU",
      text: "DADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
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
  i18n: scarViciousCheaterI18n,
};
