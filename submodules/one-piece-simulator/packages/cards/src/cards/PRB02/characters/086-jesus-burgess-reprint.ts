import type { CharacterCard } from "@tcg/op-types";
import { prb02JesusBurgessReprint086I18n } from "./086-jesus-burgess-reprint.i18n.ts";

export const prb02JesusBurgessReprint086: CharacterCard = {
  id: "OP09-086",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  traits: ["Blackbeard Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-086_p1.jpg",
      imageId: "OP09-086_p1",
    },
  ],
  effect:
    'This Character cannot be K.O.\'d by your opponent\'s effects.If your Leader has the "Blackbeard Pirates" type, this Character gains +1000 power for every 4 cards in your trash.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  i18n: prb02JesusBurgessReprint086I18n,
};
