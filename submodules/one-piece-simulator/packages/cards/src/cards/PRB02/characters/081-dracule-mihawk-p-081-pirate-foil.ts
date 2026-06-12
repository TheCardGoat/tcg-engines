import type { CharacterCard } from "@tcg/op-types";
import { prb02DraculeMihawkP081PirateFoil081I18n } from "./081-dracule-mihawk-p-081-pirate-foil.i18n.ts";

export const prb02DraculeMihawkP081PirateFoil081: CharacterCard = {
  id: "P-081",
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-081_r1.jpg",
      imageId: "P-081_r1",
    },
  ],
  effect:
    '[Activate:Main] You may return this Character to the owner\'s hand: If you have 3 or more blue "Cross Guild" type Characters, play up to 1 "Cross Guild" type Character card with a cost of 5 from your hand.',
  i18n: prb02DraculeMihawkP081PirateFoil081I18n,
};
