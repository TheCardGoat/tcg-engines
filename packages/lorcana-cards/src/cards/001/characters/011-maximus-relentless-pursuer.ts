import type { CharacterCard } from "@tcg/lorcana-types";

export const maximusRelentlessPursuer: CharacterCard = {
  id: "2z0",
  cardType: "character",
  name: "Maximus",
  version: "Relentless Pursuer",
  fullName: "Maximus - Relentless Pursuer",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  text: "Rush HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 11,
  inkable: true,
  externalIds: {
    ravensburger: "0ab6dfaa2b7d68e702c7a1f3f1ea67f1e2789b76",
  },
  abilities: [
    {
      id: "2z0-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "2z0-2",
      text: "HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
      name: "HORSE KICK",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
