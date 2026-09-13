import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { grimFeast } from "./grim-feast.ts";

export const grimFeastI18n = defineFamilyI18n(grimFeast, {
  en: {
    name: "Grim Feast",
    text: ({
      value1,
    }) => `You may play this from your banished zone. If you do, it costs {r}{r} less to play.
Gain ${value1}{h}
Blood Debt`,
    typeText: "Shadow Action",
  },
});

export const {
  red: grimFeastRedI18n,
  yellow: grimFeastYellowI18n,
  blue: grimFeastBlueI18n,
} = grimFeastI18n.cards;
