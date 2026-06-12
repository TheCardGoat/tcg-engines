import type { CharacterCard } from "@tcg/lorcana-types";
import { docTakingNotesI18n } from "./040-doc-taking-notes.i18n";

export const docTakingNotes: CharacterCard = {
  id: "wbe",
  canonicalId: "ci_wbe",
  reprints: ["set12-040"],
  cardType: "character",
  name: "Doc",
  version: "Taking Notes",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 40,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_abfe55d7cdb441b7b03deed6aec8bc1d",
  },
  text: [
    {
      title: "SHARE KNOWLEDGE",
      description:
        "When you play this character, if you have another Seven Dwarfs character or a Princess character in play, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      id: "wbe-1",
      name: "SHARE KNOWLEDGE",
      text: "SHARE KNOWLEDGE When you play this character, if you have another Seven Dwarfs character or a Princess character in play, draw a card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "or",
        conditions: [
          {
            type: "has-character-count",
            controller: "you",
            classification: "Seven Dwarfs",
            count: 1,
            comparison: "greater-or-equal",
            excludeSelf: true,
          },
          {
            type: "has-character-with-classification",
            controller: "you",
            classification: "Princess",
          },
        ],
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: docTakingNotesI18n,
};
