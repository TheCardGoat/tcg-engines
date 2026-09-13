import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cinderingForesight } from "./cindering-foresight.ts";

export const cinderingForesightI18n = defineFamilyI18n(cinderingForesight, {
  en: {
    name: "Cindering Foresight",
    text: ({ optAmount }) =>
      `If it's not your turn, you may play Cindering Foresight as though it were an instant.\nThe next card you play this turn with an effect that deals arcane damage, instead deals that much arcane damage plus 1.\nOpt ${optAmount}`,
    typeText: "Wizard Action",
  },
});

export const {
  red: cinderingForesightRedI18n,
  yellow: cinderingForesightYellowI18n,
  blue: cinderingForesightBlueI18n,
} = cinderingForesightI18n.cards;
