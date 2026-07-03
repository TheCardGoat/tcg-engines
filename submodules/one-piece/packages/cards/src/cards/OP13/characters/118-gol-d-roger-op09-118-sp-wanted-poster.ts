import type { CharacterCard } from "@tcg/op-types";
import { op13GolDRogerOp09118SpWantedPoster118I18n } from "./118-gol-d-roger-op09-118-sp-wanted-poster.i18n.ts";

export const op13GolDRogerOp09118SpWantedPoster118: CharacterCard = {
  id: "OP09-118",
  canonicalId: "OP09-118",
  slug: "gol-d-roger-op09-118-sp-wanted-poster",
  name: "Gol.D.Roger - OP09-118 (SP) (Wanted Poster)",
  printings: [
    {
      id: "OP09-118",
      artId: "OP09-118",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p3_o06WnCc.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP13",
  cost: 10,
  power: 13000,
  traits: ["Roger Pirates King of the Pirates"],
  attribute: "slash",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)When your opponent activates [Blocker], if either you or your opponent has 0 Life cards, you win the game.",
  effects: {
    keywords: ["rush", "blocker"],
    effects: [
      {
        trigger: "whenBlockerActivated",
        actions: [
          {
            action: "winGame",
          },
        ],
      },
    ],
  },
  i18n: op13GolDRogerOp09118SpWantedPoster118I18n,
};
