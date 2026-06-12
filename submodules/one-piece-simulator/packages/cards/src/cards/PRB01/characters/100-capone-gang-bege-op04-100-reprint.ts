import type { CharacterCard } from "@tcg/op-types";
import { prb01CaponeGangBegeOp04100Reprint100I18n } from "./100-capone-gang-bege-op04-100-reprint.i18n.ts";

export const prb01CaponeGangBegeOp04100Reprint100: CharacterCard = {
  id: "OP04-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB01",
  cost: 3,
  power: 3000,
  counter: 2000,
  trigger:
    "Up to 1 of your opponent's Leader or Character cards cannot attack during this turn.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  traits: ["Firetank Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p3.jpg",
      imageId: "OP04-100_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p4.jpg",
      imageId: "OP04-100_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p5.jpg",
      imageId: "OP04-100_p5",
    },
  ],
  effect:
    "[Trigger] Up to 1 of your opponent's Leader or Character cards cannot attack during this turn.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  i18n: prb01CaponeGangBegeOp04100Reprint100I18n,
};
