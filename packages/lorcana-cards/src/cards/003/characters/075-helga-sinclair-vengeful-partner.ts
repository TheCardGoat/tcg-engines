import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairVengefulPartner: CharacterCard = {
  id: "1eg",
  cardType: "character",
  name: "Helga Sinclair",
  version: "Vengeful Partner",
  fullName: "Helga Sinclair - Vengeful Partner",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  text: "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 75,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b5dc77f02c6bd98a899931617aa411e51cb55e4e",
  },
  abilities: [
    {
      id: "1eg-1",
      type: "triggered",
      name: "NOTHING PERSONAL",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
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
      text: "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
