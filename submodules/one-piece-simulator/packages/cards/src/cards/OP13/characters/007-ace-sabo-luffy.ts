import type { CharacterCard } from "@tcg/op-types";
import { op13AceSaboLuffy007I18n } from "./007-ace-sabo-luffy.i18n.ts";

export const op13AceSaboLuffy007: CharacterCard = {
  id: "OP13-007",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP13",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Goa Kingdom"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-007_p1_UuwwQ8I.jpg",
      imageId: "OP13-007_p1",
    },
  ],
  effect:
    "[Activate: Main] You may give 1 of your active DON!! cards to 1 of your Leader or Character cards and trash this Character: Give up to 1 of your opponent's Characters 3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13AceSaboLuffy007I18n,
};
