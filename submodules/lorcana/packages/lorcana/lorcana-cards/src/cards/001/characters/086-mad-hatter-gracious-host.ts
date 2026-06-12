import type { CharacterCard } from "@tcg/lorcana-types";
import { madHatterGraciousHostI18n } from "./086-mad-hatter-gracious-host.i18n";

export const madHatterGraciousHost: CharacterCard = {
  id: "7zd",
  canonicalId: "ci_7zd",
  reprints: ["set1-086"],
  cardType: "character",
  name: "Mad Hatter",
  version: "Gracious Host",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "001",
  cardNumber: 86,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_6f4d7a28b34b4520a7456a89f3d72a15",
    tcgPlayer: 508770,
  },
  text: [
    {
      title: "TEA PARTY",
      description: "Whenever this character is challenged, you may draw a card.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "hej-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "TEA PARTY",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
    },
  ],
  i18n: madHatterGraciousHostI18n,
};
