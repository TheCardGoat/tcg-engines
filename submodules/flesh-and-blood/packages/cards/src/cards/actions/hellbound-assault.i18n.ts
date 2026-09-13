import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hellboundAssault } from "./hellbound-assault.ts";

export const hellboundAssaultI18n = defineFamilyI18n(hellboundAssault, {
  en: {
    name: "Hellbound Assault",
    typeText: "Shadow Brute Action - Attack",
    text: "When this hits, banish it.\nBlood Debt",
  },
});

export const {
  red: hellboundAssaultRedI18n,
  yellow: hellboundAssaultYellowI18n,
  blue: hellboundAssaultBlueI18n,
} = hellboundAssaultI18n.cards;
