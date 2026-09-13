import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rockslideTrap } from "./rockslide-trap.ts";

export const rockslideTrapI18n = defineFamilyI18n(rockslideTrap, {
  en: {
    name: "Rockslide Trap",
    text: "Rockslide Trap can only be played from arsenal.\nWhen this defends, target attack gets -2{p}, unless the attacking hero pays {r}.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { blue: rockslideTrapBlueI18n } = rockslideTrapI18n.cards;
