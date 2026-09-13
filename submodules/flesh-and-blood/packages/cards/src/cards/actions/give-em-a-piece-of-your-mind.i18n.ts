import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { giveEmAPieceOfYourMind } from "./give-em-a-piece-of-your-mind.ts";

export const giveEmAPieceOfYourMindI18n = defineFamilyI18n(giveEmAPieceOfYourMind, {
  en: {
    name: "Give 'Em a Piece of Your Mind",
    text: "When the combat chain closes, if this didn't hit, the defending hero creates a Vigor token.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: giveEmAPieceOfYourMindRedI18n,
  yellow: giveEmAPieceOfYourMindYellowI18n,
  blue: giveEmAPieceOfYourMindBlueI18n,
} = giveEmAPieceOfYourMindI18n.cards;
