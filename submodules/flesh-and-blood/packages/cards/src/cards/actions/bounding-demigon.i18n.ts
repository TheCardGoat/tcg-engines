import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boundingDemigon } from "./bounding-demigon.ts";

export const boundingDemigonI18n = defineFamilyI18n(boundingDemigon, {
  en: {
    name: "Bounding Demigon",
    text: "If you have played a 'non-attack' action card this turn, you may play Bounding Demigon from your banished zone. If you do, it gains +1{p}.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: boundingDemigonRedI18n,
  yellow: boundingDemigonYellowI18n,
  blue: boundingDemigonBlueI18n,
} = boundingDemigonI18n.cards;
