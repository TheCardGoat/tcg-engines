import type { LeaderCard } from "@tcg/op-types";
import { op13GolDRoger003I18n } from "./003-gol-d-roger.i18n.ts";

export const op13GolDRoger003: LeaderCard = {
  id: "OP13-003",
  canonicalId: "OP13-003",
  slug: "gol-d-roger/op13-003",
  name: "Gol.D.Roger",
  printings: [
    {
      id: "OP13-003",
      artId: "OP13-003",
      setCode: "OP13",
      collectorNumber: "003",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-003_iGc1KIf.jpg",
    },
    {
      id: "OP13-003_p1",
      artId: "OP13-003_p1",
      setCode: "OP13",
      collectorNumber: "003",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-003_p1_GrKKKHI.jpg",
    },
  ],
  cardType: "leader",
  color: ["purple", "red"],
  rarity: "L",
  setId: "OP13",
  power: 7000,
  life: 5,
  traits: ["Roger Pirates King of the Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-003_p1_GrKKKHI.jpg",
      imageId: "OP13-003_p1",
    },
  ],
  effect:
    "If you have any DON!! cards on your field, 1 DON!! card placed during your DON!! Phase is given to your Leader.\nIf you have 9 or less DON!! cards on your field, give this Leader 2000 power.",
  i18n: op13GolDRoger003I18n,
};
