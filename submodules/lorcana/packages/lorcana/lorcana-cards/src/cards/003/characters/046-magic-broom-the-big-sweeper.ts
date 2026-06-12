import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomTheBigSweeperI18n } from "./046-magic-broom-the-big-sweeper.i18n";

export const magicBroomTheBigSweeper: CharacterCard = {
  id: "W8m",
  canonicalId: "ci_W8m",
  reprints: ["set3-046"],
  cardType: "character",
  name: "Magic Broom",
  version: "The Big Sweeper",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 46,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5bb1d62852d74227a37ae937c075eef0",
    tcgPlayer: 539071,
  },
  text: [
    {
      title: "CLEAN SWEEP",
      description: "While this character is at a location, it gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    {
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "xj7-1",
      name: "CLEAN SWEEP",
      text: "CLEAN SWEEP While this character is at a location, it gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: magicBroomTheBigSweeperI18n,
};
