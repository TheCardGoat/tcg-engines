import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { usurpTheShadowThrone } from "./usurp-the-shadow-throne.ts";

export const usurpTheShadowThroneI18n = defineFamilyI18n(usurpTheShadowThrone, {
  en: {
    name: "Usurp the Shadow Throne",
    typeText: "Shadow Runeblade Action - Attack",
    text: "Viserai Specialization\nIf you've usurped this turn, this costs 6{r} less to play and you may play it from your banished zone.\nWhen this hits a hero, turn all cards in their banished zone face-down. They lose X{h} and you gain X{h}, where X is the number of cards turned face-down this way.\nBlood Debt",
  },
});

export const { blue: usurpTheShadowThroneBlueI18n } = usurpTheShadowThroneI18n.cards;
