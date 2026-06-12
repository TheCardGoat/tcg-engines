import type { CharacterCard } from "@tcg/lorcana-types";
import { gloydOrangeboarFierceCompetitorI18n } from "./121-gloyd-orangeboar-fierce-competitor.i18n";

export const gloydOrangeboarFierceCompetitor: CharacterCard = {
  id: "lZz",
  canonicalId: "ci_lZz",
  reprints: ["set8-121"],
  cardType: "character",
  name: "Gloyd Orangeboar",
  version: "Fierce Competitor",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 121,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_77abad9a7ad14dd5841c473e6639eccf",
    tcgPlayer: 631705,
  },
  text: [
    {
      title: "PUMPKIN SPICE",
      description: "When you play this character, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "lose-lore",
          },
          {
            amount: 1,
            type: "gain-lore",
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
  i18n: gloydOrangeboarFierceCompetitorI18n,
};
