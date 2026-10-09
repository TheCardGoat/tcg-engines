import { defineCardI18n } from "../../authoring/card-i18n.ts";
import { barbedCastaway } from "./barbed-castaway.ts";

export const barbedCastawayI18n = defineCardI18n(barbedCastaway, {
  en: {
    name: "Barbed Castaway",
    text: "Once per Turn Instant - {r}: You may put an arrow card from your hand face up into your arsenal.\nOnce per Turn Instant - {r}: You may turn a face down arrow in your arsenal face up. If you do, put an aim counter on it.",
    typeText: "Ranger Weapon - Bow (2H)",
    abilities: {
      oncePerTurnInstantResourcePutArrowHandFaceUpArsenal: {
        displayName: "Put an arrow into arsenal",
      },
      oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter: {
        displayName: "Turn an arrow face up and add an aim counter",
      },
    },
  },
});
