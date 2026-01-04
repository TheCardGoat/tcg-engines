import type { CharacterCard } from "@tcg/lorcana-types";

export const olafTrustingCompanion: CharacterCard = {
  id: "1ki",
  cardType: "character",
  name: "Olaf",
  version: "Trusting Companion",
  fullName: "Olaf - Trusting Companion",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 150,
  inkable: true,
  externalIds: {
    ravensburger: "cbab906d9150c14ea179ca6198b84543704569f4",
  },
  abilities: [
    {
      id: "1ki-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
