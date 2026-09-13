import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { edictOfSteel } from "./edict-of-steel.ts";

export const edictOfSteelI18n = defineFamilyI18n(edictOfSteel, {
  en: {
    name: "Edict of Steel",
    text: (threshold) =>
      `Sharpen target sword you control.\nIf it has ${threshold} or more +1{p} counters, create a Flurry token.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: edictOfSteelRedI18n,
  yellow: edictOfSteelYellowI18n,
  blue: edictOfSteelBlueI18n,
} = edictOfSteelI18n.cards;
