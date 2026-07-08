import type { EventCard } from "@tcg/op-types";
import { op09ComeOnWeLlFightYou020 } from "../../OP09/events/020-come-on-we-ll-fight-you.ts";
import { prb02ComeOnWeLlFightYouManga020I18n } from "./020-come-on-we-ll-fight-you-manga.i18n.ts";

export const prb02ComeOnWeLlFightYouManga020: EventCard = {
  ...op09ComeOnWeLlFightYou020,
  id: "OP09-020_r2",
  slug: "come-on-we-ll-fight-you-manga",
  name: "Come On!! We'll Fight You!! (Manga)",
  printings: [
    {
      id: "OP09-020_r2",
      artId: "OP09-020_r2",
      setCode: "PRB02",
      collectorNumber: "020",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-020_r2.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02ComeOnWeLlFightYouManga020I18n,
};
