import type { CharacterCard } from "@tcg/lorcana-types";
import { cheshireCatNotAllThereI18n } from "./071-cheshire-cat-not-all-there.i18n";

export const cheshireCatNotAllThere: CharacterCard = {
  id: "qpX",
  canonicalId: "ci_qpX",
  reprints: ["set1-071"],
  cardType: "character",
  name: "Cheshire Cat",
  version: "Not All There",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "001",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e49c0deba37f453f8f27da810c8bfe39",
    tcgPlayer: 492122,
  },
  text: [
    {
      title: "LOSE SOMETHING?",
      description:
        "When this character is challenged and banished, banish the challenging character.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        target: {
          ref: "attacker",
        },
        type: "banish",
      },
      id: "qpX-1",
      name: "LOSE SOMETHING?",
      sourceZones: ["play", "discard"],
      text: "LOSE SOMETHING? When this character is challenged and banished, banish the challenging character.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: cheshireCatNotAllThereI18n,
};
