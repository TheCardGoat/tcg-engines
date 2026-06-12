import type { CharacterCard } from "@tcg/lorcana-types";
import { fidgetSneakyBatI18n } from "./106-fidget-sneaky-bat.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const fidgetSneakyBat: CharacterCard = {
  id: "xmE",
  canonicalId: "ci_xmE",
  reprints: ["set7-106"],
  cardType: "character",
  name: "Fidget",
  version: "Sneaky Bat",
  inkType: ["emerald", "ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  cardNumber: 106,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0306993b7adb4a52afb9ff31aea3a9b1",
    tcgPlayer: 619464,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "I TOOK CARE OF EVERYTHING",
      description:
        "Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      effect: {
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
          excludeSelf: true,
        },
        type: "gain-keyword",
      },
      id: "1lo-2",
      name: "I TOOK CARE OF EVERYTHING",
      text: "I TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fidgetSneakyBatI18n,
};
