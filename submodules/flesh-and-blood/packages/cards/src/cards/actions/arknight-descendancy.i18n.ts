import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arknightDescendancy } from "./arknight-descendancy.ts";

export const arknightDescendancyI18n = defineFamilyI18n(arknightDescendancy, {
  en: {
    name: "Arknight Descendancy",
    typeText: "Shadow Runeblade Action - Attack",
    text: "Viserai Specialization\nThis costs {r} less to play for each Runechant you control.\nWhen this is banished from anywhere, you may pay up to 3{h}. Create that many Runechant tokens.\nBlood Debt",
  },
});

export const { blue: arknightDescendancyBlueI18n } = arknightDescendancyI18n.cards;
