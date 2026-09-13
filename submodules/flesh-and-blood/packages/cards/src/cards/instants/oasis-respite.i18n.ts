import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { oasisRespite } from "./oasis-respite.ts";

export const oasisRespiteI18n = defineFamilyI18n(oasisRespite, {
  en: {
    name: "Oasis Respite",
    typeText: "Generic Instant",
    text: ({ amount }) =>
      `Prevent the next ${amount} damage that would be dealt to target hero this turn by a source of your choice. If they have less life than each other hero, they may gain 1{h}.`,
  },
});

export const {
  red: oasisRespiteRedI18n,
  yellow: oasisRespiteYellowI18n,
  blue: oasisRespiteBlueI18n,
} = oasisRespiteI18n.cards;
