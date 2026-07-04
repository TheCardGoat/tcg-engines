import type { ItemCard } from "@tcg/lorcana-types";
import { translationCollarI18n } from "./173-translation-collar.i18n";

export const translationCollar: ItemCard = {
  id: "bPp",
  canonicalId: "ci_bPp",
  slug: "lorcana-ci_bPp",
  printings: [
    {
      id: "set13-173",
      artId: "set13-173",
      setCode: "set13",
      collectorNumber: "173",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-173"],
  cardType: "item",
  name: "Translation Collar",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "013",
  cardNumber: 173,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_726d6cd31a7f4ced8ca3d502a3a4ceee",
  },
  text: [
    {
      title: "YOU ARE MY FRIEND",
      description:
        "{E}, 1 {I} — Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "YOU ARE MY FRIEND",
      text: "YOU ARE MY FRIEND {E}, 1 {I} - Chosen character gets +1 {L} and gains Support this turn.",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Support",
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
  i18n: translationCollarI18n,
};
