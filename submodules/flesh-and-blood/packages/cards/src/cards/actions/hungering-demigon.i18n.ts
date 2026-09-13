import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hungeringDemigon } from "./hungering-demigon.ts";

export const hungeringDemigonI18n = defineFamilyI18n(hungeringDemigon, {
  en: {
    name: "Hungering Demigon",
    text: "If an opposing hero has 1 or more cards in their soul, you may play this from your banished zone.\nWhen this hits a hero, banish a card from their soul.\nBlood Debt",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: hungeringDemigonRedI18n,
  yellow: hungeringDemigonYellowI18n,
  blue: hungeringDemigonBlueI18n,
} = hungeringDemigonI18n.cards;
