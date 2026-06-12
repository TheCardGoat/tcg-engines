import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaIslandExplorerI18n } from "./134-moana-island-explorer.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const moanaIslandExplorer: CharacterCard = {
  id: "Roi",
  canonicalId: "ci_Roi",
  reprints: ["set7-134"],
  cardType: "character",
  name: "Moana",
  version: "Island Explorer",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "007",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_da7a7db2845c4262be680a8a5b03c027",
    tcgPlayer: 619480,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "ADVENTUROUS SPIRIT",
      description:
        "Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    evasive,
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          excludeSelf: true,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1rb-2",
      name: "ADVENTUROUS SPIRIT",
      text: "ADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: moanaIslandExplorerI18n,
};
