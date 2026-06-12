import type { CharacterCard } from "@tcg/lorcana-types";
import { annaHeirToArendelleI18n } from "./035-anna-heir-to-arendelle.i18n";

export const annaHeirToArendelle: CharacterCard = {
  id: "PD8",
  canonicalId: "ci_PD8",
  reprints: ["set1-035"],
  cardType: "character",
  name: "Anna",
  version: "Heir to Arendelle",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 35,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e2cd50802964cfdb903d16ef856caae",
    tcgPlayer: 504444,
  },
  text: [
    {
      title: "LOVING HEART",
      description:
        "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Elsa",
        type: "has-named-character",
      },
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "restriction",
      },
      id: "ibd-1",
      name: "LOVING HEART",
      text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: annaHeirToArendelleI18n,
};
