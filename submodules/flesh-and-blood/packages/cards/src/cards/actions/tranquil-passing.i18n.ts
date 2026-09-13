import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tranquilPassing } from "./tranquil-passing.ts";

export const tranquilPassingI18n = defineFamilyI18n(tranquilPassing, {
  en: {
    name: "Tranquil Passing",
    typeText: "Illusionist Action - Aura",
    text: "When Tranquil Passing enters the arena, you may banish target aura token or aura permanent with cost 3 or less controlled by an opponent until Tranquil Passing leaves the arena.\nWard 1",
  },
});

export const {
  red: tranquilPassingRedI18n,
  yellow: tranquilPassingYellowI18n,
  blue: tranquilPassingBlueI18n,
} = tranquilPassingI18n.cards;
