import type { EventCard } from "@tcg/op-types";
import { op09GumGumLightning077 } from "../../OP09/events/077-gum-gum-lightning.ts";
import { prb02GumGumLightningPirateFoil077I18n } from "./077-gum-gum-lightning-pirate-foil.i18n.ts";

export const prb02GumGumLightningPirateFoil077: EventCard = {
  ...op09GumGumLightning077,
  id: "OP09-077_p1",
  slug: "gum-gum-lightning-pirate-foil",
  name: "Gum-Gum Lightning (Pirate Foil)",
  printings: [
    {
      id: "OP09-077_p1",
      artId: "OP09-077_p1",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-077_p1.jpg",
    },
    {
      id: "OP09-077_r2",
      artId: "OP09-077_r2",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-077_r2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-077_r2.jpg",
      imageId: "OP09-077_r2",
    },
  ],
  i18n: prb02GumGumLightningPirateFoil077I18n,
};
