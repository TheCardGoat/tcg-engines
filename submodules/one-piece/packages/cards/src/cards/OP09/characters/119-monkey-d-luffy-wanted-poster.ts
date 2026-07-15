import type { CharacterCard } from "@tcg/op-types";
import { op05MonkeyDLuffy119 } from "../../OP05/characters/119-monkey-d-luffy.ts";
import { op09MonkeyDLuffyWantedPoster119I18n } from "./119-monkey-d-luffy-wanted-poster.i18n.ts";

export const op09MonkeyDLuffyWantedPoster119: CharacterCard = {
  ...op05MonkeyDLuffy119,
  id: "OP05-119_p6",
  slug: "monkey-d-luffy-wanted-poster/op05-119",
  name: "Monkey.D.Luffy (Wanted Poster)",
  printings: [
    {
      id: "OP05-119_p6",
      artId: "OP05-119_p6",
      setCode: "OP09",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p6.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP09",
  artVariants: undefined,
  i18n: op09MonkeyDLuffyWantedPoster119I18n,
};
