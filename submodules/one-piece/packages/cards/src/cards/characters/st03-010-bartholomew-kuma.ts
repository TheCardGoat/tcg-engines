import type { CharacterCard } from "@tcg/op-types";
import { st03BartholomewKuma010I18n } from "./st03-010-bartholomew-kuma.i18n.ts";

export const st03BartholomewKuma010: CharacterCard = {
  id: "ST03-010",
  canonicalId: "ST03-010",
  slug: "bartholomew-kuma/st03-010",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "ST03-010",
      artId: "ST03-010",
      setCode: "ST03",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-010.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea", "Revolutionary Army"],
  cost: 2,
  power: 3000,
  attribute: "strike",
  effect:
    "[On Play] Look at 3 cards from the top of your deck and return them to the top or bottom of the deck in any order.",
  trigger: "Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st03BartholomewKuma010I18n,
};
