import type { CharacterCard } from "@tcg/op-types";
import { st01TonyTonyChopper006I18n } from "./st01-006-tony-tony-chopper.i18n.ts";

export const st01TonyTonyChopper006: CharacterCard = {
  id: "ST01-006",
  canonicalId: "ST01-006",
  slug: "tony-tony-chopper/st01-006",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "ST01-006",
      artId: "ST01-006",
      setCode: "ST01",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006.jpg",
    },
    {
      id: "ST01-006_p6",
      artId: "ST01-006_p6",
      setCode: "ST01",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_p6.jpg",
    },
    {
      id: "ST01-006_p7",
      artId: "ST01-006_p7",
      setCode: "ST01",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_p7.jpg",
      label: "Tony Tony.Chopper (ST01-006) (Full Art)",
    },
    {
      id: "ST01-006_p8",
      artId: "ST01-006_p8",
      setCode: "ST01",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_p8.jpg",
      label: "Tony Tony.Chopper (ST01-006) (Alternate Art)",
    },
    {
      id: "ST01-006_r1",
      artId: "ST01-006_r1",
      setCode: "ST01",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  power: 1000,
  traits: ["Animal", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: st01TonyTonyChopper006I18n,
};
