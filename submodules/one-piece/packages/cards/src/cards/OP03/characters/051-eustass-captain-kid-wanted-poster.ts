import type { CharacterCard } from "@tcg/op-types";
import { op01EustassCaptainKid051 } from "../../OP01/characters/051-eustass-captain-kid.ts";
import { op03EustassCaptainKidWantedPoster051I18n } from "./051-eustass-captain-kid-wanted-poster.i18n.ts";

export const op03EustassCaptainKidWantedPoster051: CharacterCard = {
  ...op01EustassCaptainKid051,
  id: "OP01-051_p2",
  slug: "eustass-captain-kid-wanted-poster",
  name: 'Eustass"Captain"Kid (Wanted Poster)',
  printings: [
    {
      id: "OP01-051_p2",
      artId: "OP01-051_p2",
      setCode: "OP03",
      collectorNumber: "051",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-051_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP03",
  artVariants: undefined,
  i18n: op03EustassCaptainKidWantedPoster051I18n,
};
