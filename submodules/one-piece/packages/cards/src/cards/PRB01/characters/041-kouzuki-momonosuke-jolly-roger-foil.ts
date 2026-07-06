import type { CharacterCard } from "@tcg/op-types";
import { op01KouzukiMomonosuke041 } from "../../OP01/characters/041-kouzuki-momonosuke.ts";
import { prb01KouzukiMomonosukeJollyRogerFoil041I18n } from "./041-kouzuki-momonosuke-jolly-roger-foil.i18n.ts";

export const prb01KouzukiMomonosukeJollyRogerFoil041: CharacterCard = {
  ...op01KouzukiMomonosuke041,
  id: "OP01-041_p7",
  slug: "kouzuki-momonosuke-jolly-roger-foil",
  name: "Kouzuki Momonosuke (Jolly Roger Foil)",
  printings: [
    {
      id: "OP01-041_p7",
      artId: "OP01-041_p7",
      setCode: "PRB01",
      collectorNumber: "041",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_p7.jpg",
    },
    {
      id: "OP01-041_p5",
      artId: "OP01-041_p5",
      setCode: "PRB01",
      collectorNumber: "041",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_p5.jpg",
    },
    {
      id: "OP01-041_r1",
      artId: "OP01-041_r1",
      setCode: "PRB01",
      collectorNumber: "041",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_r1.png",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_p5.jpg",
      imageId: "OP01-041_p5",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_r1.png",
      imageId: "OP01-041_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_p5_BTppBsS.jpg",
      imageId: "OP01-041_p5",
    },
  ],
  i18n: prb01KouzukiMomonosukeJollyRogerFoil041I18n,
};
