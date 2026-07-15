import type { CharacterCard } from "@tcg/op-types";
import { op01EustassCaptainKid051 } from "../../OP01/characters/051-eustass-captain-kid.ts";
import { prb01EustassCaptainKid051I18n } from "./051-eustass-captain-kid.i18n.ts";

export const prb01EustassCaptainKid051: CharacterCard = {
  ...op01EustassCaptainKid051,
  id: "OP01-051_r1",
  slug: "eustass-captain-kid/op01-051-r1",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "OP01-051_r1",
      artId: "OP01-051_r1",
      setCode: "PRB01",
      collectorNumber: "051",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-051_r1.png",
    },
    {
      id: "OP01-051_p4",
      artId: "OP01-051_p4",
      setCode: "PRB01",
      collectorNumber: "051",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-051_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-051_p4.jpg",
      imageId: "OP01-051_p4",
    },
  ],
  i18n: prb01EustassCaptainKid051I18n,
};
