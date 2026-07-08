import type { CharacterCard } from "@tcg/op-types";
import { op06RoronoaZoro118 } from "../../OP06/characters/118-roronoa-zoro.ts";
import { prb01RoronoaZoroManga118I18n } from "./118-roronoa-zoro-manga.i18n.ts";

export const prb01RoronoaZoroManga118: CharacterCard = {
  ...op06RoronoaZoro118,
  id: "OP06-118_r1",
  slug: "roronoa-zoro-manga",
  name: "Roronoa Zoro (Manga)",
  printings: [
    {
      id: "OP06-118_r1",
      artId: "OP06-118_r1",
      setCode: "PRB01",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-118_r1.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01RoronoaZoroManga118I18n,
};
