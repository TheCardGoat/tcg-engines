import type { CharacterCard } from "@tcg/lorcana-types";
import { kakamoraBoardingPartyI18n } from "./104-kakamora-boarding-party.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const kakamoraBoardingParty: CharacterCard = {
  id: "w0G",
  canonicalId: "ci_w0G",
  reprints: ["set6-104"],
  cardType: "character",
  name: "Kakamora",
  version: "Boarding Party",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  cardNumber: 104,
  rarity: "uncommon",
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c71e324054e14edfa3df845b31689f31",
    tcgPlayer: 578187,
  },
  text: "Rush",
  classifications: ["Storyborn", "Pirate"],
  abilities: [rush],
  i18n: kakamoraBoardingPartyI18n,
};
