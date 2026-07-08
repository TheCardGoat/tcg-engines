import type { CharacterCard } from "@tcg/op-types";
import { op03SpeedJil006 } from "../../OP03/characters/006-speed-jil.ts";
import { op04SpeedJilDashPack006I18n } from "./006-speed-jil-dash-pack.i18n.ts";

export const op04SpeedJilDashPack006: CharacterCard = {
  ...op03SpeedJil006,
  id: "OP03-006_OP04",
  slug: "speed-jil-dash-pack",
  name: "Speed Jil (Dash Pack)",
  printings: [
    {
      id: "OP03-006_OP04",
      artId: "OP03-006",
      setCode: "OP04",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-006.jpg",
    },
  ],
  rarity: "C",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04SpeedJilDashPack006I18n,
};
