import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chokeslam } from "./chokeslam.ts";

export const chokeslamI18n = defineFamilyI18n(chokeslam, {
  en: {
    name: "Chokeslam",
    text: "Crush - When this deals 4 or more damage to a hero, attack action cards they control can't gain {p} during their next action phase.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: chokeslamRedI18n,
  yellow: chokeslamYellowI18n,
  blue: chokeslamBlueI18n,
} = chokeslamI18n.cards;
