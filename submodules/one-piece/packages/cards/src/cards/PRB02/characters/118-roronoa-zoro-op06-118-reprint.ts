import type { CharacterCard } from "@tcg/op-types";
import { op06RoronoaZoro118 } from "../../OP06/characters/118-roronoa-zoro.ts";
import { prb02RoronoaZoroOp06118Reprint118I18n } from "./118-roronoa-zoro-op06-118-reprint.i18n.ts";

export const prb02RoronoaZoroOp06118Reprint118: CharacterCard = {
  ...op06RoronoaZoro118,
  id: "OP06-118_r2",
  slug: "roronoa-zoro-op06-118-reprint",
  name: "Roronoa Zoro - OP06-118 (Reprint)",
  printings: [
    {
      id: "OP06-118_r2",
      artId: "OP06-118_r2",
      setCode: "PRB02",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-118_r2.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02RoronoaZoroOp06118Reprint118I18n,
};
