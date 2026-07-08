import type { CharacterCard } from "@tcg/op-types";
import { op02PortgasDAce013 } from "../../OP02/characters/013-portgas-d-ace.ts";
import { prb01PortgasDAceManga013I18n } from "./013-portgas-d-ace-manga.i18n.ts";

export const prb01PortgasDAceManga013: CharacterCard = {
  ...op02PortgasDAce013,
  id: "OP02-013_r1",
  slug: "portgas-d-ace-manga",
  name: "Portgas.D.Ace (Manga)",
  printings: [
    {
      id: "OP02-013_r1",
      artId: "OP02-013_r1",
      setCode: "PRB01",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01PortgasDAceManga013I18n,
};
