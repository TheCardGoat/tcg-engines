import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { commandRespect } from "./command-respect.ts";

export const commandRespectI18n = defineFamilyI18n(commandRespect, {
  en: {
    name: "Command Respect",
    text: "When this hits a hero, if this has {p} greater than its base, destroy a card in their arsenal.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: commandRespectRedI18n,
  yellow: commandRespectYellowI18n,
  blue: commandRespectBlueI18n,
} = commandRespectI18n.cards;
