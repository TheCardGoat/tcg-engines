import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseDazzlingDancerI18n } from "./126-minnie-mouse-dazzling-dancer.i18n";

export const minnieMouseDazzlingDancer: CharacterCard = {
  id: "dg4",
  canonicalId: "ci_dg4",
  reprints: ["set5-126"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Dazzling Dancer",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 126,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_534dcd9a655747bfbcb0c52c605e9220",
    tcgPlayer: 557294,
  },
  text: [
    {
      title: "DANCE-OFF",
      description:
        "Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "git-1",
      name: "DANCE-OFF",
      text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "git-2",
      name: "DANCE-OFF",
      text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
      trigger: {
        event: "challenge",
        on: {
          controller: "you",
          cardType: "character",
          name: "Mickey Mouse",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseDazzlingDancerI18n,
};
