import type { CharacterCard } from "@tcg/lorcana-types";

export const gloydOrangeboarFierceCompetitor: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1mc-1",
      name: "PUMPKIN SPICE",
      text: "PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Racer"],
  cost: 3,
  externalIds: {
    ravensburger: "d23fb62e58a5e37fc9f04d4ead58b2087a98c49d",
  },
  franchise: "Wreck It Ralph",
  fullName: "Gloyd Orangeboar - Fierce Competitor",
  id: "1mc",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gloyd Orangeboar",
  set: "008",
  strength: 1,
  text: "PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.",
  version: "Fierce Competitor",
  willpower: 2,
};
