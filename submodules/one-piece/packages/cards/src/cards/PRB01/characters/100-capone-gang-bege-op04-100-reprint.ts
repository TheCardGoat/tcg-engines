import type { CharacterCard } from "@tcg/op-types";
import { op04CaponeGangBege100 } from "../../OP04/characters/100-capone-gang-bege.ts";
import { prb01CaponeGangBegeOp04100Reprint100I18n } from "./100-capone-gang-bege-op04-100-reprint.i18n.ts";

export const prb01CaponeGangBegeOp04100Reprint100: CharacterCard = {
  ...op04CaponeGangBege100,
  id: "OP04-100_r1",
  slug: "capone-gang-bege-op04-100-reprint",
  name: 'Capone"Gang"Bege (OP04-100) (Reprint)',
  printings: [
    {
      id: "OP04-100_r1",
      artId: "OP04-100_r1",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_r1.jpg",
    },
    {
      id: "OP04-100_p3",
      artId: "OP04-100_p3",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p3.jpg",
    },
    {
      id: "OP04-100_p4",
      artId: "OP04-100_p4",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p4.jpg",
    },
    {
      id: "OP04-100_p5",
      artId: "OP04-100_p5",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p5.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p3.jpg",
      imageId: "OP04-100_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p4.jpg",
      imageId: "OP04-100_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p5.jpg",
      imageId: "OP04-100_p5",
    },
  ],
  i18n: prb01CaponeGangBegeOp04100Reprint100I18n,
};
