import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pilferTheTomb } from "./pilfer-the-tomb.ts";

export const pilferTheTombI18n = defineFamilyI18n(pilferTheTomb, {
  en: {
    name: "Pilfer the Tomb",
    text: "Choose 1 or both;\n\nBanish target instant from an opposing hero's graveyard.\nBanish target yellow card from an opposing hero's graveyard.",
    typeText: "Generic Instant",
    abilities: {
      chooseModes: {
        modes: {
          banishTargetInstantFromOpposingHeroSGraveyard:
            "Banish target instant from an opposing hero's graveyard",
          banishTargetYellowFromOpposingHeroSGraveyard:
            "Banish target yellow card from an opposing hero's graveyard",
        },
      },
    },
  },
});

export const { blue: pilferTheTombBlueI18n } = pilferTheTombI18n.cards;
