import type { CharacterCard } from "@tcg/lorcana-types";
import { marchHareHarebrainedEccentricI18n } from "./091-march-hare-hare-brained-eccentric.i18n";

export const marchHareHarebrainedEccentric: CharacterCard = {
  id: "tzo",
  canonicalId: "ci_tzo",
  reprints: ["set8-091"],
  cardType: "character",
  name: "March Hare",
  version: "Hare-Brained Eccentric",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 91,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_03fb917c4b444c35a0f174f40655e419",
    tcgPlayer: 631410,
  },
  text: [
    {
      title: "LIGHT THE CANDLES",
      description:
        "When you play this character, you may deal 2 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: "CHOSEN_DAMAGED_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "12b-1",
      name: "LIGHT THE CANDLES",
      text: "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: marchHareHarebrainedEccentricI18n,
};
