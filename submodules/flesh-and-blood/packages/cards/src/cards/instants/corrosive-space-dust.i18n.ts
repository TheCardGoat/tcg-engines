import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { corrosiveSpaceDust } from "./corrosive-space-dust.ts";

export const corrosiveSpaceDustI18n = defineFamilyI18n(corrosiveSpaceDust, {
  en: {
    name: "Corrosive Space Dust",
    typeText: "Lightning Illusionist Instant - Aura",
    text: ({ holoWard }) =>
      `When this leaves the arena, deal 1 arcane damage to target hero. Ward X, where X is ${holoWard} if this has a holo counter. Otherwise, X is 1.`,
  },
});

export const {
  red: corrosiveSpaceDustRedI18n,
  yellow: corrosiveSpaceDustYellowI18n,
  blue: corrosiveSpaceDustBlueI18n,
} = corrosiveSpaceDustI18n.cards;
