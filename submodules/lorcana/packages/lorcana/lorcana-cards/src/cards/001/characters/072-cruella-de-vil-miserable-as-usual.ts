import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilMiserableAsUsualI18n } from "./072-cruella-de-vil-miserable-as-usual.i18n";

export const cruellaDeVilMiserableAsUsual: CharacterCard = {
  id: "UCh",
  canonicalId: "ci_UCh",
  reprints: ["set1-072"],
  cardType: "character",
  name: "Cruella De Vil",
  version: "Miserable as Usual",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "001",
  cardNumber: 72,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3a886b05f4149c695ffbd5e5b9a049f",
    tcgPlayer: 492703,
  },
  text: [
    {
      title: "YOU'LL BE SORRY!",
      description:
        "When this character is challenged and banished, you may return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "cw0-1",
      name: "YOU'LL BE SORRY!",
      sourceZones: ["play", "discard"],
      text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: cruellaDeVilMiserableAsUsualI18n,
};
