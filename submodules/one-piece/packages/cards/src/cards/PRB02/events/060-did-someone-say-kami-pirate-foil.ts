import type { EventCard } from "@tcg/op-types";
import { eb01DidSomeoneSayKami060 } from "../../EB01/events/060-did-someone-say-kami.ts";
import { prb02DidSomeoneSayKamiPirateFoil060I18n } from "./060-did-someone-say-kami-pirate-foil.i18n.ts";

export const prb02DidSomeoneSayKamiPirateFoil060: EventCard = {
  ...eb01DidSomeoneSayKami060,
  id: "EB01-060_p1",
  slug: "did-someone-say-kami-pirate-foil",
  name: "Did Someone Say...Kami? (Pirate Foil)",
  printings: [
    {
      id: "EB01-060_p1",
      artId: "EB01-060_p1",
      setCode: "PRB02",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-060_p1.jpg",
    },
    {
      id: "EB01-060_r1",
      artId: "EB01-060_r1",
      setCode: "PRB02",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-060_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-060_r1.jpg",
      imageId: "EB01-060_r1",
    },
  ],
  i18n: prb02DidSomeoneSayKamiPirateFoil060I18n,
};
