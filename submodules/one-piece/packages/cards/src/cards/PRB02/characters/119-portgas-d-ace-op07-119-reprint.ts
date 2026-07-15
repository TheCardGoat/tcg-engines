import type { CharacterCard } from "@tcg/op-types";
import { op07PortgasDAce119 } from "../../OP07/characters/119-portgas-d-ace.ts";
import { prb02PortgasDAceOp07119Reprint119I18n } from "./119-portgas-d-ace-op07-119-reprint.i18n.ts";

export const prb02PortgasDAceOp07119Reprint119: CharacterCard = {
  ...op07PortgasDAce119,
  id: "OP07-119_r1",
  slug: "portgas-d-ace-op07-119-reprint",
  name: "Portgas.D.Ace - OP07-119 (Reprint)",
  printings: [
    {
      id: "OP07-119_r1",
      artId: "OP07-119_r1",
      setCode: "PRB02",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-119_r1.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02PortgasDAceOp07119Reprint119I18n,
};
