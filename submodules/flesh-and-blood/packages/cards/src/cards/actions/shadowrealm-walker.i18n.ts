import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowrealmWalker } from "./shadowrealm-walker.ts";

export const shadowrealmWalkerI18n = defineFamilyI18n(shadowrealmWalker, {
  en: {
    name: "Shadowrealm Walker",
    typeText: "Shadow Action - Attack",
    text: "When this attacks, you may banish a card from your hand. If it's Shadow, create a Gate to i'Arathael token.\nBlood Debt",
  },
});

export const {
  red: shadowrealmWalkerRedI18n,
  yellow: shadowrealmWalkerYellowI18n,
  blue: shadowrealmWalkerBlueI18n,
} = shadowrealmWalkerI18n.cards;
