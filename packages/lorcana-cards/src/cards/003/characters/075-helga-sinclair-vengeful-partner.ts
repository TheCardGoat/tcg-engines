import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairVengefulPartner: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1eg-1",
      name: "NOTHING PERSONAL",
      text: "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "b5dc77f02c6bd98a899931617aa411e51cb55e4e",
  },
  franchise: "Atlantis",
  fullName: "Helga Sinclair - Vengeful Partner",
  id: "1eg",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Helga Sinclair",
  set: "003",
  strength: 2,
  text: "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.",
  version: "Vengeful Partner",
  willpower: 1,
};
