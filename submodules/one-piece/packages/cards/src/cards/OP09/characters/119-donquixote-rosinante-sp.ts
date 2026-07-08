import type { CharacterCard } from "@tcg/op-types";
import { op04DonquixoteRosinante119 } from "../../OP04/characters/119-donquixote-rosinante.ts";
import { op09DonquixoteRosinanteSp119I18n } from "./119-donquixote-rosinante-sp.i18n.ts";

export const op09DonquixoteRosinanteSp119: CharacterCard = {
  ...op04DonquixoteRosinante119,
  id: "OP04-119_p2",
  slug: "donquixote-rosinante-sp",
  name: "Donquixote Rosinante (SP)",
  printings: [
    {
      id: "OP04-119_p2",
      artId: "OP04-119_p2",
      setCode: "OP09",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-119_p2.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP09",
  artVariants: undefined,
  i18n: op09DonquixoteRosinanteSp119I18n,
};
