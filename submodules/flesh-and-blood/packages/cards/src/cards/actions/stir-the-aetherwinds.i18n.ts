import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stirTheAetherwinds } from "./stir-the-aetherwinds.ts";

export const stirTheAetherwindsI18n = defineFamilyI18n(stirTheAetherwinds, {
  en: {
    name: "Stir the Aetherwinds",
    text: ({ bonus }) =>
      `You may play your next Wizard 'non-attack' action card this turn as though it were an instant and if it has an effect that deals arcane damage, instead that effect deals that much arcane damage plus ${bonus}.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: stirTheAetherwindsRedI18n,
  yellow: stirTheAetherwindsYellowI18n,
  blue: stirTheAetherwindsBlueI18n,
} = stirTheAetherwindsI18n.cards;
