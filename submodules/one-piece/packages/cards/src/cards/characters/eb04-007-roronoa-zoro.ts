import type { CharacterCard } from "@tcg/op-types";
import { eb04RoronoaZoro007I18n } from "./eb04-007-roronoa-zoro.i18n.ts";

export const eb04RoronoaZoro007: CharacterCard = {
  id: "EB04-007",
  canonicalId: "EB04-007",
  slug: "roronoa-zoro/eb04-007",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "EB04-007",
      artId: "EB04-007",
      setCode: "EB04",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-007_TLnEm4i.jpg",
      label: "Roronoa Zoro (EB04-007)",
    },
    {
      id: "EB04-007_p1",
      artId: "EB04-007_p1",
      setCode: "EB04",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-007_p1_7E0hVVK.jpg",
      label: "Roronoa Zoro (EB04-007) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB04",
  cost: 7,
  power: 9000,
  traits: ["Straw Hat Crew Egghead"],
  attribute: "slash",
  effect:
    "[On Play] Your Leader gains +2000 power until the end of your opponent's next End Phase.[Activate: Main] [Once Per Turn] If your opponent has a Character with 8000 power or more, this Character gains [Rush: Character] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rushCharacter",
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb04RoronoaZoro007I18n,
};
