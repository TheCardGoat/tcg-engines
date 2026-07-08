import type { EventCard } from "@tcg/op-types";
import { op09MyEraBegins096 } from "../../OP09/events/096-my-era-begins.ts";
import { prb02MyEraBeginsReprint096I18n } from "./096-my-era-begins-reprint.i18n.ts";

export const prb02MyEraBeginsReprint096: EventCard = {
  ...op09MyEraBegins096,
  id: "OP09-096_r1",
  slug: "my-era-begins-reprint",
  name: "My Era...Begins!! (Reprint)",
  printings: [
    {
      id: "OP09-096_r1",
      artId: "OP09-096_r1",
      setCode: "PRB02",
      collectorNumber: "096",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-096_r1.jpg",
    },
    {
      id: "OP09-096_p1",
      artId: "OP09-096_p1",
      setCode: "PRB02",
      collectorNumber: "096",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-096_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-096_p1.jpg",
      imageId: "OP09-096_p1",
    },
  ],
  i18n: prb02MyEraBeginsReprint096I18n,
};
