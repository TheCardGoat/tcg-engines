import type { LeaderCard } from "@tcg/op-types";
import { op07MonkeyDDragon001 } from "../../OP07/leaders/001-monkey-d-dragon.ts";
import { eb02MonkeyDDragon001I18n } from "./001-monkey-d-dragon.i18n.ts";

export const eb02MonkeyDDragon001: LeaderCard = {
  ...op07MonkeyDDragon001,
  id: "OP07-001_aTrOjD9",
  slug: "monkey-d-dragon/op07-001-atrojd9",
  name: "Monkey.D.Dragon",
  printings: [
    {
      id: "OP07-001_aTrOjD9",
      artId: "OP07-001_aTrOjD9",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-001_aTrOjD9.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02MonkeyDDragon001I18n,
};
