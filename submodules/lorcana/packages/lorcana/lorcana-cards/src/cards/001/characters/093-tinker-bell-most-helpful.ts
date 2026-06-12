import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellMostHelpfulI18n } from "./093-tinker-bell-most-helpful.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const tinkerBellMostHelpful: CharacterCard = {
  id: "0Ez",
  canonicalId: "ci_yDh",
  reprints: ["set1-093", "set9-088"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Most Helpful",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 93,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2cb6f3824afc43249a7d4dfcdcacbd53",
    tcgPlayer: 650028,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "PIXIE DUST",
      description: "When you play this character, chosen character gains Evasive this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    evasive,
    {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "ysx-2",
      name: "PIXIE DUST",
      text: "PIXIE DUST When you play this character, chosen character gains Evasive this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellMostHelpfulI18n,
};
