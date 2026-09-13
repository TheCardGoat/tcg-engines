import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { microProcessor } from "./micro-processor.ts";

export const microProcessorI18n = defineFamilyI18n(microProcessor, {
  en: {
    name: "Micro-processor",
    text: "Data Doll Specialization\nOnce Per Turn Action - 0: Opt 1\nOnce Per Turn Action - 0: Draw a card then put a card from your hand on top of your deck.\nOnce Per Turn Action - 0: Banish the top card of your deck.\nThe first time you activate Micro-processor each turn, gain 1 action point.",
    typeText: "Mechanologist Action - Item",
    abilities: {
      oncePerTurnAction0Opt1: { displayName: "Opt 1" },
      oncePerTurnAction0DrawThenPutHandTopDeck: {
        displayName: "Draw, then put a card on top of your deck",
      },
      oncePerTurnAction0BanishTopDeck: {
        displayName: "Banish the top card of your deck",
      },
    },
  },
});

export const { blue: microProcessorBlueI18n } = microProcessorI18n.cards;
