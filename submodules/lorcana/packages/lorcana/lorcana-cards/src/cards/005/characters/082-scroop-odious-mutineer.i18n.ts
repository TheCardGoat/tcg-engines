import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroopOdiousMutineerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scroop",
    version: "Odious Mutineer",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "DO SAY HELLO TO MR.",
      },
      {
        title: "ARROW",
        description:
          "When you play this character, you may pay 3 {I} to banish chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Scroop",
    version: "Abscheulicher Meuterer",
    text: "<Wendig> Schöne Grüße an Mr. Arrow Wenn du diesen Charakter ausspielst, darfst du 3 {I} bezahlen, um einen beschädigten Charakter deiner Wahl zu verbannen.",
  },
  fr: {
    name: "Scroop",
    version: "Odieux mutin",
    text: "<Insaisissable> Va saluer de ma part M. Arrow Lorsque vous jouez ce personnage, vous pouvez payer 3 {I} pour choisir un personnage ayant au moins un dommage sur lui et le bannir.",
  },
  it: {
    name: "Scroop",
    version: "Ammutinato Detestabile",
    text: "<Sfuggente> Saluta il Signor Arrow da Parte Mia Quando giochi questo personaggio, puoi pagare 3 {I} per esiliare un personaggio danneggiato a tua scelta.",
  },
};
