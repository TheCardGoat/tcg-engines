import type { CharacterCard } from "@tcg/op-types";
import { prb02ScratchmenApooOp10108PirateFoil108I18n } from "./108-scratchmen-apoo-op10-108-pirate-foil.i18n.ts";

export const prb02ScratchmenApooOp10108PirateFoil108: CharacterCard = {
  id: "OP10-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["On-Air Pirates Supernovas"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-108_r1.jpg",
      imageId: "OP10-108_r1",
    },
  ],
  effect:
    'If you have a yellow "Supernovas" type Character other than [Scratchmen Apoo], this Character gains [Blocker].',
  i18n: prb02ScratchmenApooOp10108PirateFoil108I18n,
};
