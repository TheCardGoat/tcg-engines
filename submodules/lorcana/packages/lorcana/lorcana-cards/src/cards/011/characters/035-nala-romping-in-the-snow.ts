import type { CharacterCard } from "@tcg/lorcana-types";
import { nalaRompingInTheSnowI18n } from "./035-nala-romping-in-the-snow.i18n";

export const nalaRompingInTheSnow: CharacterCard = {
  id: "C3q",
  canonicalId: "ci_C3q",
  reprints: ["set11-035"],
  cardType: "character",
  name: "Nala",
  version: "Romping in the Snow",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "011",
  cardNumber: 35,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c86496abfa1c4cc9a138143a845e15ce",
    tcgPlayer: 674840,
  },
  text: [
    {
      title: "PLAYFUL SLIDE",
      description:
        "When you play this character, chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "leo-1",
      effect: {
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      name: "PLAYFUL SLIDE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "PLAYFUL SLIDE When you play this character, chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  i18n: nalaRompingInTheSnowI18n,
};
