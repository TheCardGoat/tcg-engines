import type { CharacterCard } from "@tcg/op-types";
import { op04DonquixoteDoflamingo031 } from "../../OP04/characters/031-donquixote-doflamingo.ts";
import { prb01DonquixoteDoflamingoReprint031I18n } from "./031-donquixote-doflamingo-reprint.i18n.ts";

export const prb01DonquixoteDoflamingoReprint031: CharacterCard = {
  ...op04DonquixoteDoflamingo031,
  id: "OP04-031_r1",
  slug: "donquixote-doflamingo-reprint",
  name: "Donquixote Doflamingo (Reprint)",
  printings: [
    {
      id: "OP04-031_r1",
      artId: "OP04-031_r1",
      setCode: "PRB01",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-031_r1.jpg",
    },
    {
      id: "OP04-031_p3",
      artId: "OP04-031_p3",
      setCode: "PRB01",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-031_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-031_p3.jpg",
      imageId: "OP04-031_p3",
    },
  ],
  i18n: prb01DonquixoteDoflamingoReprint031I18n,
};
