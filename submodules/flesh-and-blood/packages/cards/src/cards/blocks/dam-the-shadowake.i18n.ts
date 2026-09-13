import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { damTheShadowake } from "./dam-the-shadowake.ts";

export const damTheShadowakeI18n = defineFamilyI18n(damTheShadowake, {
  en: {
    name: "Dam the Shadowake",
    typeText: "Shadow Block",
    text: "When this defends a Shadow hero's attack, create a Gate to i'Arathael token.",
  },
});

export const {
  red: damTheShadowakeRedI18n,
  yellow: damTheShadowakeYellowI18n,
  blue: damTheShadowakeBlueI18n,
} = damTheShadowakeI18n.cards;
