import type { CharacterCard } from "@tcg/op-types";
import { op06HitokiriKamazo076 } from "../../OP06/characters/076-hitokiri-kamazo.ts";
import { prb02HitokiriKamazoPirateFoil076I18n } from "./076-hitokiri-kamazo-pirate-foil.i18n.ts";

export const prb02HitokiriKamazoPirateFoil076: CharacterCard = {
  ...op06HitokiriKamazo076,
  id: "OP06-076_p2",
  slug: "hitokiri-kamazo-pirate-foil",
  name: "Hitokiri Kamazo (Pirate Foil)",
  printings: [
    {
      id: "OP06-076_p2",
      artId: "OP06-076_p2",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-076_p2.jpg",
    },
    {
      id: "OP06-076_r1",
      artId: "OP06-076_r1",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-076_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-076_r1.jpg",
      imageId: "OP06-076_r1",
    },
  ],
  i18n: prb02HitokiriKamazoPirateFoil076I18n,
};
