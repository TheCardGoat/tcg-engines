import type { CharacterCard } from "@tcg/lorcana-types";
import { docTakingNotesEpicI18n } from "./210-doc-taking-notes-epic.i18n";

export const docTakingNotesEpic: CharacterCard = {
  id: "j0D",
  canonicalId: "ci_wbe",
  slug: "lorcana-ci_wbe",
  printings: [
    {
      id: "set12-210-epic",
      artId: "ci_wbe-epic",
      setCode: "set12",
      collectorNumber: "210",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-040"],
  cardType: "character",
  name: "Doc",
  version: "Taking Notes",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fd529e637c964866821ab9f2946451cb",
    tcgPlayer: "692207",
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
  i18n: docTakingNotesEpicI18n,
};
