import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuYourWorstNightmareI18n } from "./142-mushu-your-worst-nightmare.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const mushuYourWorstNightmare: CharacterCard = {
  id: "dhS",
  canonicalId: "ci_wxW",
  reprints: ["set8-142"],
  cardType: "character",
  name: "Mushu",
  version: "Your Worst Nightmare",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 142,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4ea909f6818d4776ae936aa51aed88b8",
    tcgPlayer: 632228,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "ALL FIRED UP",
      description:
        "Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. (They can challenge the turn they're played. They can't quest and must challenge if able. They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Floodborn", "Ally", "Dragon"],
  abilities: [
    shift(4),
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Rush",
            duration: "this-turn",
            target: "TRIGGERING_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Reckless",
            duration: "this-turn",
            target: "TRIGGERING_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "this-turn",
            target: "TRIGGERING_CHARACTER",
          },
        ],
      },
      id: "qm5-2",
      name: "ALL FIRED UP",
      text: "ALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mushuYourWorstNightmareI18n,
};
