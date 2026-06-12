import type { CharacterCard } from "@tcg/lorcana-types";
import { turboRoyalHackI18n } from "./106-turbo-royal-hack.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const turboRoyalHack: CharacterCard = {
  id: "42e",
  canonicalId: "ci_42e",
  reprints: ["set5-106"],
  cardType: "character",
  name: "Turbo",
  version: "Royal Hack",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 106,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c53a525669114b578666906f5adff421",
    tcgPlayer: 555260,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "GAME JUMP",
      description: "This character also counts as being named King Candy for Shift.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Racer"],
  abilities: [
    rush,
    {
      id: "42e-2",
      name: "GAME JUMP",
      text: "GAME JUMP This character also counts as being named King Candy for Shift.",
      type: "static",
      effect: {
        type: "property-modification",
        property: "name",
        operation: "add-alias",
        value: "King Candy",
        target: "SELF",
      },
    },
  ],
  i18n: turboRoyalHackI18n,
};
