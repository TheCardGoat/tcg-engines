import type { StageCard } from "@tcg/op-types";
import { prb02CorridaColiseumPirateFoil096I18n } from "./096-corrida-coliseum-pirate-foil.i18n.ts";

export const prb02CorridaColiseumPirateFoil096: StageCard = {
  id: "OP04-096",
  canonicalId: "OP04-096",
  slug: "corrida-coliseum-pirate-foil",
  name: "Corrida Coliseum (Pirate Foil)",
  printings: [
    {
      id: "OP04-096",
      artId: "OP04-096",
      setCode: "PRB02",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_p1.jpg",
    },
    {
      id: "OP04-096_r1",
      artId: "OP04-096_r1",
      setCode: "PRB02",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_r1.jpg",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Dressrosa"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_r1.jpg",
      imageId: "OP04-096_r1",
    },
  ],
  effect:
    "If your Leader has the [Dressrosa] type, your [Dressrosa] type Characters can attack Characters on the turn in which they are played.",
  i18n: prb02CorridaColiseumPirateFoil096I18n,
};
