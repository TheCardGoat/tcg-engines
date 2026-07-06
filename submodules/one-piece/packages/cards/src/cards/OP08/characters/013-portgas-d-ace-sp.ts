import type { CharacterCard } from "@tcg/op-types";
import { op02PortgasDAce013 } from "../../OP02/characters/013-portgas-d-ace.ts";
import { op08PortgasDAceSp013I18n } from "./013-portgas-d-ace-sp.i18n.ts";

export const op08PortgasDAceSp013: CharacterCard = {
  ...op02PortgasDAce013,
  id: "OP02-013_p3",
  slug: "portgas-d-ace-sp/op02-013",
  name: "Portgas.D.Ace (SP)",
  printings: [
    {
      id: "OP02-013_p3",
      artId: "OP02-013_p3",
      setCode: "OP08",
      collectorNumber: "013",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013_p3.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP08",
  artVariants: undefined,
  i18n: op08PortgasDAceSp013I18n,
};
