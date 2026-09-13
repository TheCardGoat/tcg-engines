import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mockingBlow } from "./mocking-blow.ts";

export const mockingBlowI18n = defineFamilyI18n(mockingBlow, {
  en: {
    name: "Mocking Blow",
    text: "When this attacks a hero, if you have more {h} than them, the crowd boos you.\nIf you've been booed this turn, this gets +4{p}.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: mockingBlowRedI18n,
  yellow: mockingBlowYellowI18n,
  blue: mockingBlowBlueI18n,
} = mockingBlowI18n.cards;
