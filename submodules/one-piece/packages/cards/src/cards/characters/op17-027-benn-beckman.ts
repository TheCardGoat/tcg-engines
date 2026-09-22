import type { CharacterCard } from "@tcg/op-types";
import { op17BennBeckman027I18n } from "./op17-027-benn-beckman.i18n.ts";

export const op17BennBeckman027: CharacterCard = {
  id: "OP17-027",
  canonicalId: "OP17-027",
  slug: "benn-beckman/op17-027",
  name: "Benn.Beckman",
  printings: [
    {
      id: "OP17-027",
      artId: "OP17-027",
      setCode: "OP17",
      collectorNumber: "027",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-027_TGT0QIl.jpg",
    },
    {
      id: "OP17-027_p1",
      artId: "OP17-027_p1",
      setCode: "OP17",
      collectorNumber: "027",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-027_p1_Nsw0pyo.jpg",
      label: "Benn.Beckman (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP17",
  cost: 7,
  power: 9000,
  counter: 9000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.)\n[On Play] If your Leader has the {Red-Haired Pirates} type, draw 1 card and rest up to 2 of your opponent's Characters.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Red-Haired Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op17BennBeckman027I18n,
};
