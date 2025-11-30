import type { CharacterCard } from "@tcg/lorcana";

export const olafTrustingCompanion: CharacterCard = {
  id: "1ki",
  cardType: "character",
  name: "Olaf",
  version: "Trusting Companion",
  fullName: "Olaf - Trusting Companion",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "Support (Whenever this character quests, you may add their to another chosen character’s this turn.)",
  cardNumber: "150",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "cbab906d9150c14ea179ca6198b84543704569f4",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "1ki-ability-1",
      text: "Support (Whenever this character quests, you may add their to another chosen character’s this turn.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
