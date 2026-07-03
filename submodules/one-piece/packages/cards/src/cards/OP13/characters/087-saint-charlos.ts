import type { CharacterCard } from "@tcg/op-types";
import { op13SaintCharlos087I18n } from "./087-saint-charlos.i18n.ts";

export const op13SaintCharlos087: CharacterCard = {
  id: "OP13-087",
  canonicalId: "OP13-087",
  slug: "saint-charlos/op13-087",
  name: "Saint Charlos",
  printings: [
    {
      id: "OP13-087",
      artId: "OP13-087",
      setCode: "OP13",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-087_99GpR8n.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP13",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] Trash 1 card from the top of your deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13SaintCharlos087I18n,
};
