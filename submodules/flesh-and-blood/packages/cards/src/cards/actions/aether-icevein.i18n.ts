import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherIcevein } from "./aether-icevein.ts";

export const aetherIceveinI18n = defineFamilyI18n(aetherIcevein, {
  en: {
    name: "Aether Icevein",
    text: (_parameter, color) =>
      `Ice Fusion\nDeal ${color === "red" ? 5 : color === "yellow" ? 4 : 3} arcane damage to any target. If Aether Icevein was fused and deals damage to a hero, they discard a card unless they pay {r}{r}.`,
    typeText: "Elemental Wizard Action",
  },
});

export const {
  red: aetherIceveinRedI18n,
  yellow: aetherIceveinYellowI18n,
  blue: aetherIceveinBlueI18n,
} = aetherIceveinI18n.cards;
