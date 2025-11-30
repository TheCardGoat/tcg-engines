import type { CharacterCard } from "@tcg/lorcana";

export const palaceGuardSpectralSentry: CharacterCard = {
  id: "1v0",
  cardType: "character",
  name: "Palace Guard",
  version: "Spectral Sentry",
  fullName: "Palace Guard - Spectral Sentry",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "008",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)",
  cardNumber: "045",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "f1807bfd473e7be0f8010219734c4c6a9702ffd5",
  },
  keywords: ["Vanish"],
  abilities: [
    {
      id: "1v0a1",
      text: "Vanish",
      type: "keyword",
      keyword: "Vanish",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};
