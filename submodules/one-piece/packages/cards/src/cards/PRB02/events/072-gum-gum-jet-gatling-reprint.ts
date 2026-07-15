import type { EventCard } from "@tcg/op-types";
import { op03GumGumJetGatling072 } from "../../OP03/events/072-gum-gum-jet-gatling.ts";
import { prb02GumGumJetGatlingReprint072I18n } from "./072-gum-gum-jet-gatling-reprint.i18n.ts";

export const prb02GumGumJetGatlingReprint072: EventCard = {
  ...op03GumGumJetGatling072,
  id: "OP03-072_r1",
  slug: "gum-gum-jet-gatling-reprint",
  name: "Gum-Gum Jet Gatling (Reprint)",
  printings: [
    {
      id: "OP03-072_r1",
      artId: "OP03-072_r1",
      setCode: "PRB02",
      collectorNumber: "072",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-072_r1.jpg",
    },
    {
      id: "OP03-072_p1",
      artId: "OP03-072_p1",
      setCode: "PRB02",
      collectorNumber: "072",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-072_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-072_p1.jpg",
      imageId: "OP03-072_p1",
    },
  ],
  i18n: prb02GumGumJetGatlingReprint072I18n,
};
