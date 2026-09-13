import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { layToRest } from "./lay-to-rest.ts";

export const layToRestI18n = defineFamilyI18n(layToRest, {
  en: {
    name: "Lay to Rest",
    typeText: "Light Action - Attack",
    text: "When this attacks a Shadow hero, it gets +1{p}.\nWhen this hits a hero, you may turn a card in their banished zone face-down.",
  },
});

export const {
  red: layToRestRedI18n,
  yellow: layToRestYellowI18n,
  blue: layToRestBlueI18n,
} = layToRestI18n.cards;
