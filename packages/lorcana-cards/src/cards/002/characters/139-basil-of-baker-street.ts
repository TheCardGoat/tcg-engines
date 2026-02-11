import type { CharacterCard } from "@tcg/lorcana-types";

export const basilOfBakerStreet: CharacterCard = {
  abilities: [
    {
      id: "1xt-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 139,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 2,
  externalIds: {
    ravensburger: "fba07c9e309578673beb0679dd654ab701fc31bb",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Of Baker Street",
  id: "1xt",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Basil",
  set: "002",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Of Baker Street",
  willpower: 2,
};
