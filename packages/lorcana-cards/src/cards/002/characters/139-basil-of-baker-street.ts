import type { CharacterCard } from "@tcg/lorcana-types";

export const basilOfBakerStreet: CharacterCard = {
  id: "1xt",
  cardType: "character",
  name: "Basil",
  version: "Of Baker Street",
  fullName: "Basil - Of Baker Street",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "fba07c9e309578673beb0679dd654ab701fc31bb",
  },
  abilities: [
    {
      id: "1xt-1",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
