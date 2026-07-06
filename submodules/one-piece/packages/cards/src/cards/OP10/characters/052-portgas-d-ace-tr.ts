import type { CharacterCard } from "@tcg/op-types";
import { op08PortgasDAce052 } from "../../OP08/characters/052-portgas-d-ace.ts";
import { op10PortgasDAceTr052I18n } from "./052-portgas-d-ace-tr.i18n.ts";

export const op10PortgasDAceTr052: CharacterCard = {
  ...op08PortgasDAce052,
  id: "OP08-052_p2",
  slug: "portgas-d-ace-tr",
  name: "Portgas.D.Ace (TR)",
  printings: [
    {
      id: "OP08-052_p2",
      artId: "OP08-052_p2",
      setCode: "OP10",
      collectorNumber: "052",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-052_p2.png",
    },
  ],
  rarity: "TR",
  setId: "OP10",
  artVariants: undefined,
  i18n: op10PortgasDAceTr052I18n,
};
