import type { CharacterCard } from "@tcg/lorcana-types";
import { sirKayDeterminedToWinI18n } from "./181-sir-kay-determined-to-win.i18n";

export const sirKayDeterminedToWin: CharacterCard = {
  id: "omF",
  canonicalId: "ci_omF",
  slug: "lorcana-ci_omF",
  printings: [
    {
      id: "set14-181",
      artId: "set14-181",
      setCode: "set14",
      collectorNumber: "181",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-181"],
  cardType: "character",
  name: "Sir Kay",
  version: "Determined to Win",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 181,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Competitive Edge",
      description:
        "While you have an ink drop, this character gains Challenger +3. (They get +3 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Knight"],
  abilities: [
    {
      id: "sir-kay-1",
      name: "Competitive Edge",
      type: "static",
      text: "Competitive Edge While you have an ink drop, this character gains Challenger +3.",
      condition: {
        type: "resource-count",
        what: "ink-drops",
        controller: "you",
        comparison: "greater-or-equal",
        value: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        target: "SELF",
      },
    },
  ],
  i18n: sirKayDeterminedToWinI18n,
};
