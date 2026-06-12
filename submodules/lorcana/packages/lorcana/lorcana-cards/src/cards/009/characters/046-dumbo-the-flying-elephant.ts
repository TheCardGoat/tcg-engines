import type { CharacterCard } from "@tcg/lorcana-types";
import { dumboTheFlyingElephantI18n } from "./046-dumbo-the-flying-elephant.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const dumboTheFlyingElephant: CharacterCard = {
  id: "nnC",
  canonicalId: "ci_nnC",
  reprints: ["set9-046"],
  cardType: "character",
  name: "Dumbo",
  version: "The Flying Elephant",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  cardNumber: 46,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1c42d9e976d0414099a145227b83b08c",
    tcgPlayer: 647679,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "AERIAL DUO",
      description:
        "When you play this character, chosen character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    evasive,
    {
      effect: {
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "ab9-2",
      name: "AERIAL DUO",
      text: "AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dumboTheFlyingElephantI18n,
};
