import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riftedTorment } from "./rifted-torment.ts";

export const riftedTormentI18n = defineFamilyI18n(riftedTorment, {
  en: {
    name: "Rifted Torment",
    text: "You may play Rifted Torment from your banished zone. If you do, deal 1 arcane damage to target hero.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: riftedTormentRedI18n,
  yellow: riftedTormentYellowI18n,
  blue: riftedTormentBlueI18n,
} = riftedTormentI18n.cards;
