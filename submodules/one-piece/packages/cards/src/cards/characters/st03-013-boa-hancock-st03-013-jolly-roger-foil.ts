import type { CharacterCard } from "@tcg/op-types";
import { prb01BoaHancockSt03013JollyRogerFoil013I18n } from "./st03-013-boa-hancock-st03-013-jolly-roger-foil.i18n.ts";

export const prb01BoaHancockSt03013JollyRogerFoil013: CharacterCard = {
  id: "ST03-013",
  canonicalId: "ST03-013",
  slug: "boa-hancock-st03-013-jolly-roger-foil",
  name: "Boa Hancock",
  printings: [
    {
      id: "ST03-013",
      artId: "ST03-013",
      setCode: "ST03",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p2.png",
      label: "Boa Hancock (ST03-013) (Jolly Roger Foil)",
    },
    {
      id: "ST03-013_p3",
      artId: "ST03-013_p3",
      setCode: "ST03",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p3.jpg",
      label: "Boa Hancock (ST03-013) (Full Art)",
    },
    {
      id: "ST03-013_r1",
      artId: "ST03-013_r1",
      setCode: "ST03",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_r1.jpg",
    },
    {
      id: "ST03-013_p4",
      artId: "ST03-013_p4",
      setCode: "ST03",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-013_p4.jpg",
      label: "Boa Hancock (ST03-013) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
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
