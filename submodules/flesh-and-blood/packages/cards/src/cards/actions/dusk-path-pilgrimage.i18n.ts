import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { duskPathPilgrimage } from "./dusk-path-pilgrimage.ts";

export const duskPathPilgrimageI18n = defineFamilyI18n(duskPathPilgrimage, {
  en: {
    name: "Dusk Path Pilgrimage",
    text: (amount) =>
      `Your next weapon attack this turn gains +${amount}{p} and "If this hits, you may attack an additional time with this weapon this turn."\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: duskPathPilgrimageRedI18n,
  yellow: duskPathPilgrimageYellowI18n,
  blue: duskPathPilgrimageBlueI18n,
} = duskPathPilgrimageI18n.cards;
