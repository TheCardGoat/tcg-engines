import type { CharacterCard } from "@tcg/op-types";
import { op05OneLeggedToySoldier081 } from "../../OP05/characters/081-one-legged-toy-soldier.ts";
import { prb01OneLeggedToySoldierJollyRogerFoil081I18n } from "./081-one-legged-toy-soldier-jolly-roger-foil.i18n.ts";

export const prb01OneLeggedToySoldierJollyRogerFoil081: CharacterCard = {
  ...op05OneLeggedToySoldier081,
  id: "OP05-081_p2",
  slug: "one-legged-toy-soldier-jolly-roger-foil",
  name: "One-Legged Toy Soldier (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-081_p2",
      artId: "OP05-081_p2",
      setCode: "PRB01",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p2.jpg",
    },
    {
      id: "OP05-081_r1",
      artId: "OP05-081_r1",
      setCode: "PRB01",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_r1.jpg",
    },
    {
      id: "OP05-081_p3",
      artId: "OP05-081_p3",
      setCode: "PRB01",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p3.jpg",
    },
    {
      id: "OP05-081_p4",
      artId: "OP05-081_p4",
      setCode: "PRB01",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p4.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_r1.jpg",
      imageId: "OP05-081_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p3.jpg",
      imageId: "OP05-081_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p4.jpg",
      imageId: "OP05-081_p4",
    },
  ],
  i18n: prb01OneLeggedToySoldierJollyRogerFoil081I18n,
};
