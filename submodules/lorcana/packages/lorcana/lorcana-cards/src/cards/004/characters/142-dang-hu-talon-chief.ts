import type { CharacterCard } from "@tcg/lorcana-types";
import { dangHuTalonChiefI18n } from "./142-dang-hu-talon-chief.i18n";

export const dangHuTalonChief: CharacterCard = {
  id: "52U",
  canonicalId: "ci_52U",
  reprints: ["set4-142"],
  cardType: "character",
  name: "Dang Hu",
  version: "Talon Chief",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 142,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e74340fa12045cb9bdb4824d72f2ad3",
    tcgPlayer: 549247,
  },
  text: [
    {
      title: "YOU BETTER TALK FAST",
      description:
        "Your other Villain characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        keyword: "Support",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Villain",
            },
          ],
          excludeSelf: true,
        },
        type: "gain-keyword",
      },
      id: "tq9-1",
      name: "YOU BETTER TALK FAST",
      text: "YOU BETTER TALK FAST Your other Villain characters gain Support.",
      type: "static",
    },
  ],
  i18n: dangHuTalonChiefI18n,
};
