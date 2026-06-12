import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiBumblingRoosterI18n } from "./075-heihei-bumbling-rooster.i18n";

export const heiheiBumblingRooster: CharacterCard = {
  id: "vJ2",
  canonicalId: "ci_Vh7",
  reprints: ["set4-075", "set9-086"],
  cardType: "character",
  name: "HeiHei",
  version: "Bumbling Rooster",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "004",
  cardNumber: 75,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fe534ba2bc92411385d7176097db4f43",
    tcgPlayer: 650026,
  },
  text: [
    {
      title: "FATTEN YOU UP",
      description:
        "When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "comparison",
        left: { type: "cards-in-inkwell", controller: "opponent" },
        comparison: "greater",
        right: { type: "cards-in-inkwell", controller: "you" },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
      },
      id: "td9-1",
      name: "FATTEN YOU UP",
      text: "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: heiheiBumblingRoosterI18n,
};
