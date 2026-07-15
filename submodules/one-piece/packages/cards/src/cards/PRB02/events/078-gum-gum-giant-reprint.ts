import type { EventCard } from "@tcg/op-types";
import { op09GumGumGiant078 } from "../../OP09/events/078-gum-gum-giant.ts";
import { prb02GumGumGiantReprint078I18n } from "./078-gum-gum-giant-reprint.i18n.ts";

export const prb02GumGumGiantReprint078: EventCard = {
  ...op09GumGumGiant078,
  id: "OP09-078_r1",
  slug: "gum-gum-giant-reprint",
  name: "Gum-Gum Giant (Reprint)",
  printings: [
    {
      id: "OP09-078_r1",
      artId: "OP09-078_r1",
      setCode: "PRB02",
      collectorNumber: "078",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-078_r1.jpg",
    },
    {
      id: "OP09-078_p1",
      artId: "OP09-078_p1",
      setCode: "PRB02",
      collectorNumber: "078",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-078_p1_QtJ1DiN.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-078_p1_QtJ1DiN.jpg",
      imageId: "OP09-078_p1",
    },
  ],
  i18n: prb02GumGumGiantReprint078I18n,
};
