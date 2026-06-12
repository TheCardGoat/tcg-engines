import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinIntrepidCommanderI18n } from "./119-aladdin-intrepid-commander.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const aladdinIntrepidCommander: CharacterCard = {
  id: "brg",
  canonicalId: "ci_brg",
  reprints: ["set6-119"],
  cardType: "character",
  name: "Aladdin",
  version: "Intrepid Commander",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 119,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a5acdc20f6a54938be2874ab080a9053",
    tcgPlayer: 588075,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "REMEMBER YOUR TRAINING",
      description: "When you play this character, your characters get +2 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(2),
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "z1l-2",
      name: "REMEMBER YOUR TRAINING",
      text: "REMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: aladdinIntrepidCommanderI18n,
};
