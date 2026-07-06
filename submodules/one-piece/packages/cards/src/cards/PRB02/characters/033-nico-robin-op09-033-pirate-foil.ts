import type { CharacterCard } from "@tcg/op-types";
import { op09NicoRobin033 } from "../../OP09/characters/033-nico-robin.ts";
import { prb02NicoRobinOp09033PirateFoil033I18n } from "./033-nico-robin-op09-033-pirate-foil.i18n.ts";

export const prb02NicoRobinOp09033PirateFoil033: CharacterCard = {
  ...op09NicoRobin033,
  id: "OP09-033_p1",
  slug: "nico-robin-op09-033-pirate-foil",
  name: "Nico Robin - OP09-033 (Pirate Foil)",
  printings: [
    {
      id: "OP09-033_p1",
      artId: "OP09-033_p1",
      setCode: "PRB02",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-033_p1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-033_r1.jpg",
      imageId: "OP09-033",
    },
  ],
  i18n: prb02NicoRobinOp09033PirateFoil033I18n,
};
