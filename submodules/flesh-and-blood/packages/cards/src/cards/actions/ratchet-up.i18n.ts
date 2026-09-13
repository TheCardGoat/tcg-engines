import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ratchetUp } from "./ratchet-up.ts";

export const ratchetUpI18n = defineFamilyI18n(ratchetUp, {
  en: {
    name: "Ratchet Up",
    text: "If an item you control has been destroyed this turn, action cards get -1{d} while defending this.\nGalvanize - When this defends, you may destroy an item you control. If you do, this gets +2{d}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: ratchetUpRedI18n,
  yellow: ratchetUpYellowI18n,
  blue: ratchetUpBlueI18n,
} = ratchetUpI18n.cards;
