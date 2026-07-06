import type { LeaderCard } from "@tcg/op-types";
import { op07Foxy059 } from "../../OP07/leaders/059-foxy.ts";
import { eb02Foxy059I18n } from "./059-foxy.i18n.ts";

export const eb02Foxy059: LeaderCard = {
  ...op07Foxy059,
  id: "OP07-059_KlofiS1",
  slug: "foxy/op07-059-klofis1",
  name: "Foxy",
  printings: [
    {
      id: "OP07-059_KlofiS1",
      artId: "OP07-059_KlofiS1",
      setCode: "EB02",
      collectorNumber: "059",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-059_KlofiS1.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Foxy059I18n,
};
