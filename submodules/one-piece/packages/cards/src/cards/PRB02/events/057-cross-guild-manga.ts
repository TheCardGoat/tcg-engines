import type { EventCard } from "@tcg/op-types";
import { op09CrossGuild057 } from "../../OP09/events/057-cross-guild.ts";
import { prb02CrossGuildManga057I18n } from "./057-cross-guild-manga.i18n.ts";

export const prb02CrossGuildManga057: EventCard = {
  ...op09CrossGuild057,
  id: "OP09-057_r2",
  slug: "cross-guild-manga",
  name: "Cross Guild (Manga)",
  printings: [
    {
      id: "OP09-057_r2",
      artId: "OP09-057_r2",
      setCode: "PRB02",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-057_r2.jpg",
    },
    {
      id: "OP09-057_r1",
      artId: "OP09-057_r1",
      setCode: "PRB02",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-057_r1_Ert5om6.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-057_r1_Ert5om6.jpg",
      imageId: "OP09-057_r1",
    },
  ],
  i18n: prb02CrossGuildManga057I18n,
};
