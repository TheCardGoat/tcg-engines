import type { StageCard } from "@tcg/op-types";
import { op04CorridaColiseum096 } from "../../OP04/stages/096-corrida-coliseum.ts";
import { prb02CorridaColiseumPirateFoil096I18n } from "./096-corrida-coliseum-pirate-foil.i18n.ts";

export const prb02CorridaColiseumPirateFoil096: StageCard = {
  ...op04CorridaColiseum096,
  id: "OP04-096_p1",
  slug: "corrida-coliseum-pirate-foil",
  name: "Corrida Coliseum (Pirate Foil)",
  printings: [
    {
      id: "OP04-096_p1",
      artId: "OP04-096_p1",
      setCode: "PRB02",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_p1.jpg",
    },
    {
      id: "OP04-096_r1",
      artId: "OP04-096_r1",
      setCode: "PRB02",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_r1.jpg",
      imageId: "OP04-096_r1",
    },
  ],
  i18n: prb02CorridaColiseumPirateFoil096I18n,
};
