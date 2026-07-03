import type { CharacterCard } from "@tcg/op-types";
import { op03Blueno090I18n } from "./090-blueno.i18n.ts";

export const op03Blueno090: CharacterCard = {
  id: "OP03-090",
  canonicalId: "OP03-090",
  slug: "blueno/op03-090",
  name: "Blueno",
  printings: [
    {
      id: "OP03-090",
      artId: "OP03-090",
      setCode: "OP03",
      collectorNumber: "090",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-090.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  effect:
    '[DON!! x1] [This Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Play up to 1 Character card with a type including "CP" and a cost of 4 or less from your trash rested.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op03Blueno090I18n,
};
