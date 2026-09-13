import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { enshrineSin } from "./enshrine-sin.ts";

export const enshrineSinI18n = defineFamilyI18n(enshrineSin, {
  en: {
    name: "Enshrine Sin",
    typeText: "Shadow Runeblade Action",
    text: "You may play this from your banished zone. If you do, it costs an additional {r} to play.\nOpt 1, then create a Runechant token. Go again\nBlood Debt",
  },
});

export const {
  red: enshrineSinRedI18n,
  yellow: enshrineSinYellowI18n,
  blue: enshrineSinBlueI18n,
} = enshrineSinI18n.cards;
