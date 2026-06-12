import type { CharacterCard } from "@tcg/op-types";
import { prb01SatoriJollyRogerFoil105I18n } from "./105-satori-jolly-roger-foil.i18n.ts";

export const prb01SatoriJollyRogerFoil105: CharacterCard = {
  id: "OP05-105",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB01",
  cost: 5,
  power: 5000,
  counter: 2000,
  trigger: "You may trash 1 card from your hand: Play this card.",
  traits: ["Sky Island Vassals"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_r1.jpg",
      imageId: "OP05-105_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p3.jpg",
      imageId: "OP05-105_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p4.jpg",
      imageId: "OP05-105_p4",
    },
  ],
  effect: "[Trigger] You may trash 1 card from your hand: Play this card.",
  i18n: prb01SatoriJollyRogerFoil105I18n,
};
