import type { CharacterCard } from "@tcg/lorcana-types";
import { dumptruckKarnagesSecondMateI18n } from "./185-dumptruck-karnages-second-mate.i18n";

export const dumptruckKarnagesSecondMate: CharacterCard = {
  id: "ufJ",
  canonicalId: "ci_ufJ",
  reprints: ["set8-185"],
  cardType: "character",
  name: "Dumptruck",
  version: "Karnage's Second Mate",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "008",
  cardNumber: 185,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_43f09ed39a77426a8a351ed3446d180a",
    tcgPlayer: 631770,
  },
  text: [
    {
      title: "LET ME AT 'EM",
      description: "When you play this character, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "vwi-1",
      name: "LET ME AT 'EM",
      text: "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dumptruckKarnagesSecondMateI18n,
};
