import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { glacialFootsteps } from "./glacial-footsteps.ts";

export const glacialFootstepsI18n = defineFamilyI18n(glacialFootsteps, {
  en: {
    name: "Glacial Footsteps",
    text: "Ice Fusion\nIf Glacial Footsteps was fused, it gains dominate.",
    typeText: "Elemental Guardian Action - Attack",
  },
});

export const {
  red: glacialFootstepsRedI18n,
  yellow: glacialFootstepsYellowI18n,
  blue: glacialFootstepsBlueI18n,
} = glacialFootstepsI18n.cards;
