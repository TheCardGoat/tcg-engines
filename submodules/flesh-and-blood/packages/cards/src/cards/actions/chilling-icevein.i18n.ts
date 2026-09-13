import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chillingIcevein } from "./chilling-icevein.ts";

export const chillingIceveinI18n = defineFamilyI18n(chillingIcevein, {
  en: {
    name: "Chilling Icevein",
    text: "Ice Fusion\nIf Chilling Icevein was fused, whenever an attack deals damage to a hero this turn, they discard a card unless they pay {r}.",
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: chillingIceveinRedI18n,
  yellow: chillingIceveinYellowI18n,
  blue: chillingIceveinBlueI18n,
} = chillingIceveinI18n.cards;
