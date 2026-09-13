import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riftBind } from "./rift-bind.ts";

export const riftBindI18n = defineFamilyI18n(riftBind, {
  en: {
    name: "Rift Bind",
    text: "You may play Rift Bind from your banished zone. If you do, it gains +X{p}, where X is the number of 'non-attack' action cards you have played this turn.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: riftBindRedI18n,
  yellow: riftBindYellowI18n,
  blue: riftBindBlueI18n,
} = riftBindI18n.cards;
