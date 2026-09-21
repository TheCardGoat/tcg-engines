import type { CharacterCard } from "@tcg/op-types";
import { eb04Kaku043I18n } from "./eb04-043-kaku.i18n.ts";

export const eb04Kaku043: CharacterCard = {
  id: "EB04-043",
  canonicalId: "EB04-043",
  slug: "kaku/eb04-043",
  name: "Kaku",
  printings: [
    {
      id: "EB04-043",
      artId: "EB04-043",
      setCode: "EB04",
      collectorNumber: "043",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-043_F5TMqyO.jpg",
    },
    {
      id: "EB04-043_p1",
      artId: "EB04-043_p1",
      setCode: "EB04",
      collectorNumber: "043",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-043_p1_dzUFugk.jpg",
      label: "Kaku (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB04",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["CP0 Egghead"],
  attribute: "slash",
  effect:
    "[Once Per Turn] If your black Character with a base cost of 5 or less would be K.O.'d by your opponent's effect, you may place 3 cards from your trash at the bottom of your deck in any order instead.\n[On Play] Trash 2 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "color",
              value: "black",
            },
            {
              filter: "baseCost",
              comparison: "lte",
              value: 5,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["trash"],
            count: {
              amount: 3,
            },
          },
          position: "bottom",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb04Kaku043I18n,
};
