import type { CharacterCard } from "@tcg/lorcana-types";

export const olafTrustingCompanion: CharacterCard = {
  abilities: [
    {
      id: "1ki-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 150,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "cbab906d9150c14ea179ca6198b84543704569f4",
  },
  franchise: "Frozen",
  fullName: "Olaf - Trusting Companion",
  id: "1ki",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Olaf",
  set: "004",
  strength: 1,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Trusting Companion",
  willpower: 2,
};
