import type { CharacterCard } from "@tcg/op-types";
import { op16Sakazuk065I18n } from "./op16-065-sakazuk.i18n.ts";

export const op16Sakazuk065: CharacterCard = {
  id: "OP16-065",
  canonicalId: "OP16-065",
  slug: "sakazuk/op16-065",
  name: "Sakazuk",
  printings: [
    {
      id: "OP16-065",
      artId: "OP16-065",
      setCode: "OP16",
      collectorNumber: "065",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-065_9MZHftQ.jpg",
    },
    {
      id: "OP16-065_p1",
      artId: "OP16-065_p2",
      setCode: "OP16",
      collectorNumber: "065",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-065_p2_5xfdpdu.jpg",
      label: "Sakazuki (Manga)",
    },
    {
      id: "OP16-065_p2",
      artId: "OP16-065_p1",
      setCode: "OP16",
      collectorNumber: "065",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-065_p1_WITXouO.jpg",
      label: "Sakazuki (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP16",
  cost: 7,
  power: 8000,
  traits: ["Navy Admiral"],
  attribute: "special",
  effect:
    "[On Play] DON!! -1: Give up to 1 of your opponent's Characters -6000 power until the end of your opponent's next End Phase. [Activate:Main] [Once Per Turn] You may rest 1 of your DON!! cards: If your Leader has the {Navy} type, add up to 2 DON!! cards from your DON!! deck and set them as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
            value: -6000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 2,
              upTo: true,
            },
            state: "active",
            condition: {
              condition: "leaderTrait",
              trait: "Navy",
              match: "includes",
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op16Sakazuk065I18n,
};
