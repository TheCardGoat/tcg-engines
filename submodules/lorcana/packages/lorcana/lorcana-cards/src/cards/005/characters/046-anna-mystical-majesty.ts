import type { CharacterCard } from "@tcg/lorcana-types";
import { annaMysticalMajestyI18n } from "./046-anna-mystical-majesty.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const annaMysticalMajesty: CharacterCard = {
  id: "JaG",
  canonicalId: "ci_JaG",
  reprints: ["set5-046"],
  cardType: "character",
  name: "Anna",
  version: "Mystical Majesty",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 46,
  rarity: "rare",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_2254457f8600435abc8520521283f8ff",
    tcgPlayer: 561952,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "EXCEPTIONAL POWER",
      description: "When you play this character, exert all opposing characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    shift(4),
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "iok-2",
      name: "EXCEPTIONAL POWER",
      text: "EXCEPTIONAL POWER When you play this character, exert all opposing characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: annaMysticalMajestyI18n,
};
