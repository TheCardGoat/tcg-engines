import type { CharacterCard } from "@tcg/op-types";
import { prb01BoaHancockSt03013JollyRogerFoil013I18n } from "./013-boa-hancock-st03-013-jolly-roger-foil.i18n.ts";

export const prb01BoaHancockSt03013JollyRogerFoil013: CharacterCard = {
  id: "ST03-013",
  canonicalId: "ST03-013",
  slug: "boa-hancock-st03-013-jolly-roger-foil",
  name: "Boa Hancock (ST03-013) (Jolly Roger Foil)",
  printings: [
    {
      id: "ST03-013",
      artId: "ST03-013",
      setCode: "PRB01",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p2.png",
    },
    {
      id: "ST03-013_p3",
      artId: "ST03-013_p3",
      setCode: "PRB01",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p3.jpg",
    },
    {
      id: "ST03-013_r1",
      artId: "ST03-013_r1",
      setCode: "PRB01",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_r1.png",
    },
    {
      id: "ST03-013_p4",
      artId: "ST03-013_p4",
      setCode: "PRB01",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p4.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB01",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p3.jpg",
      imageId: "ST03-013_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_r1.png",
      imageId: "ST03-013_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p4.jpg",
      imageId: "ST03-013_p4",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Trigger] Play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: prb01BoaHancockSt03013JollyRogerFoil013I18n,
};
