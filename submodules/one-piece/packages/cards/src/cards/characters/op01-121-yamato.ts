import type { CharacterCard } from "@tcg/op-types";
import { op01Yamato121I18n } from "./op01-121-yamato.i18n.ts";

export const op01Yamato121: CharacterCard = {
  id: "OP01-121",
  canonicalId: "OP01-121",
  slug: "yamato/op01-121",
  name: "Yamato",
  printings: [
    {
      id: "OP01-121",
      artId: "OP01-121",
      setCode: "OP01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121.jpg",
    },
    {
      id: "OP01-121_p1",
      artId: "OP01-121_p1",
      setCode: "OP01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p1.jpg",
    },
    {
      id: "OP01-121_p2",
      artId: "OP01-121_p2",
      setCode: "OP01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p2.jpg",
    },
    {
      id: "OP01-121_p4",
      artId: "OP01-121_p4",
      setCode: "OP01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p4.jpg",
      label: "Yamato (OP01-121) (Alternate Art)",
    },
    {
      id: "OP01-121_p7",
      artId: "OP01-121_p7",
      setCode: "OP01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p7.jpg",
    },
  ],
  cardType: "character",
  alternateNames: ["Kouzuki Oden"],
  color: ["green"],
  rarity: "SEC",
  setId: "OP01",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",

  effect:
    "Also treat this card's name as [Kouzuki Oden] according to the rules. [Double Attack] (This card deals 2 damage.) [Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    keywords: ["doubleAttack", "banish"],
  },
  i18n: op01Yamato121I18n,
};
