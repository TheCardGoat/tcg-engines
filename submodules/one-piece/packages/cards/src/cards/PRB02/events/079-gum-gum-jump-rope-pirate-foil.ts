import type { EventCard } from "@tcg/op-types";
import { op09GumGumJumpRope079 } from "../../OP09/events/079-gum-gum-jump-rope.ts";
import { prb02GumGumJumpRopePirateFoil079I18n } from "./079-gum-gum-jump-rope-pirate-foil.i18n.ts";

export const prb02GumGumJumpRopePirateFoil079: EventCard = {
  ...op09GumGumJumpRope079,
  id: "OP09-079_p1",
  slug: "gum-gum-jump-rope-pirate-foil",
  name: "Gum-Gum Jump Rope (Pirate Foil)",
  printings: [
    {
      id: "OP09-079_p1",
      artId: "OP09-079_p1",
      setCode: "PRB02",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-079_p1.jpg",
    },
    {
      id: "OP09-079_r1",
      artId: "OP09-079_r1",
      setCode: "PRB02",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-079_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-079_r1.jpg",
      imageId: "OP09-079_r1",
    },
  ],
  i18n: prb02GumGumJumpRopePirateFoil079I18n,
};
