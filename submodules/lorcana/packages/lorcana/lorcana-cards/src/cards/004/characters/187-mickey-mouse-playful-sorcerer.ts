import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMousePlayfulSorcererI18n } from "./187-mickey-mouse-playful-sorcerer.i18n";
import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";

export const mickeyMousePlayfulSorcerer: CharacterCard = {
  id: "QEb",
  canonicalId: "ci_mJq",
  reprints: ["set4-187"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Playful Sorcerer",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  cardNumber: 187,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bd9957831e61475fa527ff77c2976f40",
    tcgPlayer: 544485,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Resist +1",
    },
    {
      title: "SWEEP AWAY",
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
  i18n: mickeyMousePlayfulSorcererI18n,
};
