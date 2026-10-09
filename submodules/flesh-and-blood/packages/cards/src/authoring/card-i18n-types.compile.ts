import { barbedCastaway } from "../cards/weapons/barbed-castaway.ts";
import { defineCardI18n } from "./card-i18n.ts";

defineCardI18n(barbedCastaway, {
  en: {
    name: "Barbed Castaway",
    typeText: "Ranger Weapon - Bow (2H)",
    abilities: {
      oncePerTurnInstantResourcePutArrowHandFaceUpArsenal: {
        displayName: "Put an arrow into arsenal",
      },
    },
  },
});

defineCardI18n(barbedCastaway, {
  en: {
    name: "Barbed Castaway",
    typeText: "Ranger Weapon - Bow (2H)",
    abilities: {
      // @ts-expect-error localization keys must match authored card abilities
      unknownAbility: { displayName: "Unknown" },
    },
  },
});
