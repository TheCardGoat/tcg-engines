import type { CharacterCard } from "@tcg/op-types";
import { op16BoaHancock032I18n } from "./op16-032-boa-hancock.i18n.ts";

export const op16BoaHancock032: CharacterCard = {
  id: "OP16-032",
  canonicalId: "OP16-032",
  slug: "boa-hancock/op16-032",
  name: "Boa Hancock",
  printings: [
    {
      id: "OP16-032",
      artId: "OP16-032",
      setCode: "OP16",
      collectorNumber: "032",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-032_ejQ0TgZ.jpg",
    },
    {
      id: "OP16-032_p1",
      artId: "OP16-032_p1",
      setCode: "OP16",
      collectorNumber: "032",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-032_p1_YgUseLD.jpg",
      label: "Boa Hancock (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP16",
  cost: 7,
  power: 9000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea Impel Down"],
  attribute: "special",
  effect:
    "[Unblockable] (This card cannot be blocked.) [On Play] Up to 1 of your opponent's Characters other than [Monkey.D.Luffy] cannot be rested until the end of your opponent's next End Phase.",
  effects: {
    keywords: ["unblockable"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: op16BoaHancock032I18n,
};
