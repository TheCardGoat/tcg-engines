import type { EventCard } from "@tcg/op-types";
import { op06WhiteSnake059 } from "../../OP06/events/059-white-snake.ts";
import { prb02WhiteSnakePirateFoil059I18n } from "./059-white-snake-pirate-foil.i18n.ts";

export const prb02WhiteSnakePirateFoil059: EventCard = {
  ...op06WhiteSnake059,
  id: "OP06-059_p1",
  slug: "white-snake-pirate-foil",
  name: "White Snake (Pirate Foil)",
  printings: [
    {
      id: "OP06-059_p1",
      artId: "OP06-059_p1",
      setCode: "PRB02",
      collectorNumber: "059",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-059_p1.jpg",
    },
    {
      id: "OP06-059_r1",
      artId: "OP06-059_r1",
      setCode: "PRB02",
      collectorNumber: "059",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-059_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-059_r1.jpg",
      imageId: "OP06-059_r1",
    },
  ],
  i18n: prb02WhiteSnakePirateFoil059I18n,
};
