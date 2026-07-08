import type { LeaderCard } from "@tcg/op-types";
import { op08TonyTonyChopper001 } from "../../OP08/leaders/001-tony-tony-chopper.ts";
import { eb02TonyTonyChopper001I18n } from "./001-tony-tony-chopper.i18n.ts";

export const eb02TonyTonyChopper001: LeaderCard = {
  ...op08TonyTonyChopper001,
  id: "OP08-001_txo981N",
  slug: "tony-tony-chopper/op08-001-txo981n",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP08-001_txo981N",
      artId: "OP08-001_txo981N",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-001_txo981N.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02TonyTonyChopper001I18n,
};
