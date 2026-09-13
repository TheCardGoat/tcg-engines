import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { badBreath } from "./bad-breath.ts";

export const badBreathI18n = defineFamilyI18n(badBreath, {
  en: {
    name: "Bad Breath",
    text: (_parameter, color) =>
      `Intimidate target hero.\nThe next time an attack you control hits this turn, create ${color === "red" ? 3 : color === "yellow" ? 2 : "a"} Might token${color === "blue" ? "" : "s"}.\nGo again`,
    typeText: "Reviled Action",
  },
});
export const {
  red: badBreathRedI18n,
  yellow: badBreathYellowI18n,
  blue: badBreathBlueI18n,
} = badBreathI18n.cards;
