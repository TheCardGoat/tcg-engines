import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brainFreeze } from "./brain-freeze.ts";

export const brainFreezeI18n = defineFamilyI18n(brainFreeze, {
  en: {
    name: "Brain Freeze",
    text: (_parameter, color) =>
      `Ice Fusion\nTarget opponent reveals their hand. If this was fused, put an action card with cost ${color === "red" ? 2 : color === "yellow" ? 1 : 0}${color === "blue" ? "" : " or less"} from their hand on top of their deck.`,
    typeText: "Elemental Wizard Action",
  },
});

export const {
  red: brainFreezeRedI18n,
  yellow: brainFreezeYellowI18n,
  blue: brainFreezeBlueI18n,
} = brainFreezeI18n.cards;
