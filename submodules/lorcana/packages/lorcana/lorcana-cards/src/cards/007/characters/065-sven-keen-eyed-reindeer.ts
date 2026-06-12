import type { CharacterCard } from "@tcg/lorcana-types";
import { svenKeeneyedReindeerI18n } from "./065-sven-keen-eyed-reindeer.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const svenKeeneyedReindeer: CharacterCard = {
  id: "snv",
  canonicalId: "ci_snv",
  reprints: ["set7-065"],
  cardType: "character",
  name: "Sven",
  version: "Keen-Eyed Reindeer",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 65,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7b2b13682a1c4b4198f7c27df73abc46",
    tcgPlayer: 618135,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "FORMIDABLE GLARE",
      description: "When you play this character, chosen character gets -3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    rush,
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "dna-2",
      name: "FORMIDABLE GLARE",
      text: "FORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: svenKeeneyedReindeerI18n,
};
