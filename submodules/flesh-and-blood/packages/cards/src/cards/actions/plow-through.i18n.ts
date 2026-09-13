import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plowThrough } from "./plow-through.ts";

export const plowThroughI18n = defineFamilyI18n(plowThrough, {
  en: {
    name: "Plow Through",
    text: ({
      value1,
    }) => `Your next weapon attack this turn gains +${value1}{p} and "If this weapon is defended by an attack action card, it gains +1{p} until end of turn."
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: plowThroughRedI18n,
  yellow: plowThroughYellowI18n,
  blue: plowThroughBlueI18n,
} = plowThroughI18n.cards;
