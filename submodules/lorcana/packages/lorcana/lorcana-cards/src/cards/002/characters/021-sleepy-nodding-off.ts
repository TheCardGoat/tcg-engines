import type { CharacterCard } from "@tcg/lorcana-types";
import { sleepyNoddingOffI18n } from "./021-sleepy-nodding-off.i18n";

export const sleepyNoddingOff: CharacterCard = {
  id: "42K",
  canonicalId: "ci_42K",
  reprints: ["set2-021"],
  cardType: "character",
  name: "Sleepy",
  version: "Nodding Off",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 21,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_02c9d135c9774d4ca1cd3a70c62cd9f1",
    tcgPlayer: 526366,
  },
  text: [
    {
      title: "YAWN!",
      description: "This character enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "1e7-1",
      name: "YAWN!",
      text: "YAWN! This character enters play exerted.",
      type: "static",
    },
  ],
  i18n: sleepyNoddingOffI18n,
};
