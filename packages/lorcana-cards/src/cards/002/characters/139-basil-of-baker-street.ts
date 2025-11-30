import type { CharacterCard } from "@tcg/lorcana";

export const basilOfBakerStreet: CharacterCard = {
  id: "1xt",
  cardType: "character",
  name: "Basil",
  version: "Of Baker Street",
  fullName: "Basil - Of Baker Street",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "139",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "fba07c9e309578673beb0679dd654ab701fc31bb",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "1xt-ability-1",
      text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
