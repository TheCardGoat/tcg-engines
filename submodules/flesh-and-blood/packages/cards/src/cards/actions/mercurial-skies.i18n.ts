import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mercurialSkies } from "./mercurial-skies.ts";

export const mercurialSkiesI18n = defineFamilyI18n(mercurialSkies, {
  en: {
    name: "Mercurial Skies",
    text: ({
      arcaneDamage,
    }) => `The next Runeblade or Lightning attack action card you play this turn gets go again and "The first time this deals damage to a hero, you may destroy a Lightning Flow you control. If you do, deal ${arcaneDamage} arcane damage to them."
Go again`,
    typeText: "Lightning Runeblade Action",
  },
});

export const {
  red: mercurialSkiesRedI18n,
  yellow: mercurialSkiesYellowI18n,
  blue: mercurialSkiesBlueI18n,
} = mercurialSkiesI18n.cards;
