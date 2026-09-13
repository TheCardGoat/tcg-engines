import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { smashWithBigTree } from "./smash-with-big-tree.ts";

export const smashWithBigTreeI18n = defineFamilyI18n(smashWithBigTree, {
  en: {
    name: "Smash with Big Tree",
    text: "",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: smashWithBigTreeRedI18n,
  yellow: smashWithBigTreeYellowI18n,
  blue: smashWithBigTreeBlueI18n,
} = smashWithBigTreeI18n.cards;
