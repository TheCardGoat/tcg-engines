import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sigilOfPermafrost } from "./sigil-of-permafrost.ts";

export const sigilOfPermafrostI18n = defineFamilyI18n(sigilOfPermafrost, {
  en: {
    name: "Sigil of Permafrost",
    text: "Ice Fusion\nIf Sigil of Permafrost was fused, the next time you deal arcane damage to a hero this turn, create that many Frostbite tokens under their control.",
    typeText: "Elemental Wizard Defense Reaction",
  },
});

export const {
  red: sigilOfPermafrostRedI18n,
  yellow: sigilOfPermafrostYellowI18n,
  blue: sigilOfPermafrostBlueI18n,
} = sigilOfPermafrostI18n.cards;
