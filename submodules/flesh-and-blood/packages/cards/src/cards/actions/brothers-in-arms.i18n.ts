import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brothersInArms } from "./brothers-in-arms.ts";

export const brothersInArmsI18n = defineFamilyI18n(brothersInArms, {
  en: {
    name: "Brothers in Arms",
    typeText: "Generic Action - Attack",
    text: "When this defends, you may pay {r}. If you do, it gets +2{d}.",
  },
});

export const {
  red: brothersInArmsRedI18n,
  yellow: brothersInArmsYellowI18n,
  blue: brothersInArmsBlueI18n,
} = brothersInArmsI18n.cards;
