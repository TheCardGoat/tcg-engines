import type { CharacterCard } from "@tcg/op-types";
import { op17Blenheim012I18n } from "./op17-012-blenheim.i18n.ts";

export const op17Blenheim012: CharacterCard = {
  id: "OP17-012",
  canonicalId: "OP17-012",
  slug: "blenheim/op17-012",
  name: "Blenheim",
  printings: [
    {
      id: "OP17-012",
      artId: "OP17-012",
      setCode: "OP17",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-012_SE1tslP.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On K.O.] Play up to 1 card with a cost of 1 and a type including "Whitebeard Pirates" from your hand.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op17Blenheim012I18n,
};
