import type { CharacterCard } from "@tcg/lorcana-types";

export const gloydOrangeboarFierceCompetitor: CharacterCard = {
  id: "1mc",
  cardType: "character",
  name: "Gloyd Orangeboar",
  version: "Fierce Competitor",
  fullName: "Gloyd Orangeboar - Fierce Competitor",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d23fb62e58a5e37fc9f04d4ead58b2087a98c49d",
  },
  abilities: [
    {
      id: "1mc-1",
      type: "triggered",
      name: "PUMPKIN SPICE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "lose-lore",
            amount: 1,
            target: "EACH_OPPONENT",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
};
