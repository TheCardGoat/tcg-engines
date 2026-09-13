import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rifting } from "./rifting.ts";

export const riftingI18n = defineFamilyI18n(rifting, {
  en: {
    name: "Rifting",
    text: "If Rifting hits, you may play your next 'non-attack' action card this turn as though it were an instant.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: riftingRedI18n,
  yellow: riftingYellowI18n,
  blue: riftingBlueI18n,
} = riftingI18n.cards;
