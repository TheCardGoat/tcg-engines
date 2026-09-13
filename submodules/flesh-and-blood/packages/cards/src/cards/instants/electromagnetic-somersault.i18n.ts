import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { electromagneticSomersault } from "./electromagnetic-somersault.ts";

export const electromagneticSomersaultI18n = defineFamilyI18n(electromagneticSomersault, {
  en: {
    name: "Electromagnetic Somersault",
    typeText: "Lightning Instant",
    text: (minimumCost) =>
      `Choose up to 2 attack action cards with cost ${minimumCost} or more on the active chain link. Return them to their owner's hand when the chain link resolves.`,
  },
});

export const {
  red: electromagneticSomersaultRedI18n,
  yellow: electromagneticSomersaultYellowI18n,
  blue: electromagneticSomersaultBlueI18n,
} = electromagneticSomersaultI18n.cards;
