import type { CharacterCard } from "@tcg/op-types";
import { eb04Koby044I18n } from "./eb04-044-koby.i18n.ts";

export const eb04Koby044: CharacterCard = {
  id: "EB04-044",
  canonicalId: "EB04-044",
  slug: "koby/eb04-044",
  name: "Koby",
  printings: [
    {
      id: "EB04-044",
      artId: "EB04-044",
      setCode: "EB04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-044_evnJnB8.jpg",
      label: "Koby (EB04-044)",
    },
    {
      id: "EB04-044_p1",
      artId: "EB04-044_p2",
      setCode: "EB04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-044_p2.jpg",
      label: "Koby (EB04-044) (Manga)",
    },
    {
      id: "EB04-044_p2",
      artId: "EB04-044_p1",
      setCode: "EB04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-044_p1_VWzlrOD.jpg",
      label: "Koby (EB04-044) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB04",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Navy SWORD"],
  attribute: "strike",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        oncePerTurn: true,
        oncePerTurnKey: "eb04-044-removal-replacement",
        eventFilter: {
          targetSelf: true,
        },
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
          },
        ],
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
      },
      {
        replacedEvent: "removeFromField",
        oncePerTurn: true,
        oncePerTurnKey: "eb04-044-removal-replacement",
        eventFilter: {
          targetSelf: true,
        },
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
          },
        ],
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
      },
      {
        replacedEvent: "leaveField",
        oncePerTurn: true,
        oncePerTurnKey: "eb04-044-removal-replacement",
        eventFilter: {
          targetSelf: true,
        },
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
          },
        ],
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
      },
    ],
    effects: [
      {
        trigger: "whenCharacterKod",
        eventFilter: {
          player: "opponent",
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        oncePerTurn: true,
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb04Koby044I18n,
};
