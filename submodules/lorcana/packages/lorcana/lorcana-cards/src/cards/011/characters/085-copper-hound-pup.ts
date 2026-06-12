import type { CharacterCard } from "@tcg/lorcana-types";
import { copperHoundPupI18n } from "./085-copper-hound-pup.i18n";

export const copperHoundPup: CharacterCard = {
  id: "zR1",
  canonicalId: "ci_zR1",
  reprints: ["set11-085"],
  cardType: "character",
  name: "Copper",
  version: "Hound Pup",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 85,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_47915154ee494451b714c3ec1084331a",
    tcgPlayer: 676203,
  },
  text: [
    {
      title: "FOUND YA",
      description: "When you play this character, chosen player reveals their hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Puppy"],
  abilities: [
    {
      id: "zR1-1",
      type: "triggered",
      name: "FOUND YA",
      text: "FOUND YA When you play this character, chosen player reveals their hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "reveal-hand",
        target: "CHOSEN_PLAYER",
      },
    },
  ],
  i18n: copperHoundPupI18n,
};
