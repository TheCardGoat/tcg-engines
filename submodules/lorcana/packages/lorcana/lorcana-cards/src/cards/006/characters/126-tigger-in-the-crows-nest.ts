import type { CharacterCard } from "@tcg/lorcana-types";
import { tiggerInTheCrowsNestI18n } from "./126-tigger-in-the-crows-nest.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const tiggerInTheCrowsNest: CharacterCard = {
  id: "puw",
  canonicalId: "ci_yVQ",
  reprints: ["set6-126"],
  cardType: "character",
  name: "Tigger",
  version: "In the Crow's Nest",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 126,
  rarity: "rare",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_865641f3cac34a65a36bb2404f4e39dd",
    tcgPlayer: 592037,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "SWASH YOUR BUCKLES",
      description: "Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Tigger", "Pirate"],
  abilities: [
    evasive,
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 1,
            stat: "strength",
            target: "SELF",
            type: "modify-stat",
          },
          {
            duration: "this-turn",
            modifier: 1,
            stat: "lore",
            target: "SELF",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "1q4-2",
      name: "SWASH YOUR BUCKLES",
      text: "SWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tiggerInTheCrowsNestI18n,
};
