import type { CharacterCard } from "@tcg/op-types";
import { prb02NicoRobinOp09033PirateFoil033I18n } from "./033-nico-robin-op09-033-pirate-foil.i18n.ts";

export const prb02NicoRobinOp09033PirateFoil033: CharacterCard = {
  id: "OP09-033",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-033_r1.jpg",
      imageId: "OP09-033",
    },
  ],
  effect:
    '[On Play] If you have 2 or more rested Characters, none of your "ODYSSEY" or "Straw Hat Crew" type Characters can be K.O.\'d by effects until the end of your opponent\'s next turn.',
  i18n: prb02NicoRobinOp09033PirateFoil033I18n,
};
