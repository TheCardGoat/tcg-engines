import type { CharacterCard } from "@tcg/lorcana-types";
import { wendyDarlingPirateQueenI18n } from "./012-wendy-darling-pirate-queen.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const wendyDarlingPirateQueen: CharacterCard = {
  id: "3a1",
  canonicalId: "ci_3a1",
  reprints: ["set7-012"],
  cardType: "character",
  name: "Wendy Darling",
  version: "Pirate Queen",
  inkType: ["amber", "ruby"],
  franchise: "Peter Pan",
  set: "007",
  cardNumber: 12,
  rarity: "uncommon",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f25f3276ffc641a6a188b538ca96ac6a",
    tcgPlayer: 619413,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "TELL NO TALES",
      description:
        "Whenever one of your other characters is banished, you may remove all damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Pirate", "Captain"],
  abilities: [
    evasive,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: "all",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "3a1-2",
      name: "TELL NO TALES",
      text: "TELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: wendyDarlingPirateQueenI18n,
};
