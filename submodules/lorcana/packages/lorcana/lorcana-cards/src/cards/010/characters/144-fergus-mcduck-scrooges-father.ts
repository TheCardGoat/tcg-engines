import type { CharacterCard } from "@tcg/lorcana-types";
import { fergusMcduckScroogesFatherI18n } from "./144-fergus-mcduck-scrooges-father.i18n";

export const fergusMcduckScroogesFather: CharacterCard = {
  id: "sKm",
  canonicalId: "ci_sKm",
  reprints: ["set10-144"],
  cardType: "character",
  name: "Fergus McDuck",
  version: "Scrooge's Father",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 144,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a6ad0755a1114acca877267acb719f59",
    tcgPlayer: 659601,
  },
  text: [
    {
      title: "TOUGHEN UP",
      description:
        "When you play this character, chosen character of yours gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "xuv-1",
      name: "TOUGHEN UP",
      text: "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: fergusMcduckScroogesFatherI18n,
};
