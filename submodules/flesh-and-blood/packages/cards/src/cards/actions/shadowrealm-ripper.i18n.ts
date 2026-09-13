import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowrealmRipper } from "./shadowrealm-ripper.ts";

export const shadowrealmRipperI18n = defineFamilyI18n(shadowrealmRipper, {
  en: {
    name: "Shadowrealm Ripper",
    typeText: "Shadow Action - Attack",
    text: "When this attacks, you may banish a card from your hand. If it's Shadow, this gets +2{p}.\nBlood Debt",
  },
});

export const {
  red: shadowrealmRipperRedI18n,
  yellow: shadowrealmRipperYellowI18n,
  blue: shadowrealmRipperBlueI18n,
} = shadowrealmRipperI18n.cards;
