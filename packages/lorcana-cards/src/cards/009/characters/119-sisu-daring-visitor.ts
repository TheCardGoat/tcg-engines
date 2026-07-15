import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuDaringVisitor: CharacterCard = {
  abilities: [
    {
      id: "1y1-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1y1-2",
      name: "BRING ON THE HEAT!",
      text: "BRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 119,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  cost: 3,
  externalIds: {
    ravensburger: "fc67550a3eb2e05ff941e3dd9ba390ad5570186e",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Sisu - Daring Visitor",
  id: "1y1",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Sisu",
  set: "009",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nBRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.",
  version: "Daring Visitor",
  willpower: 1,
};
