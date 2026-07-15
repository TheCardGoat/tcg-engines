import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMousePlayfulSorcererD23I18n } from "./d23-007-mickey-mouse-playful-sorcerer.i18n";

import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";

export const mickeyMousePlayfulSorcererD23: CharacterCard = {
  id: "Y3Q",
  canonicalId: "ci_QEb",
  slug: "lorcana-ci_QEb",
  printings: [
    {
      id: "set4-d23-007",
      artId: "set4-d23-007",
      setCode: "set4",
      collectorNumber: "7",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set4-d23-007", "set4-187"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Playful Sorcerer",
  inkType: ["steel"],
  franchise: "D23",
  set: "004",
  cardNumber: 7,
  rarity: "special",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_db6db54405ff449ba819ed521fae7df0",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Resist +1",
    },
    {
      title: "Sweep Away",
      description:
        "When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Sorcerer"],
  abilities: [
    shift(3),
    resist(1),
    {
      effect: {
        amount: {
          cardTypes: ["character"],
          excludeSelf: true,
          filters: [{ type: "has-classification", classification: "Broom" }],
          owner: "you",
          type: "filtered-count",
          zones: ["play"],
        },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "QEb-3",
      name: "SWEEP AWAY",
      text: "SWEEP AWAY When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMousePlayfulSorcererD23I18n,
};
