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
    text: [
      {
        title: "Wendig",
      },
      {
        title: "SCHÖNE GRÜSSE AN MR.",
      },
      {
        title: "ARROW",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 3 bezahlen, um einen beschädigten Charakter deiner Wahl zu verbannen.",
      },
    ],
  },
  fr: {
    name: "Scroop",
    version: "Odieux mutin",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "VA SALUER DE MA PART M.",
      },
      {
        title: "ARROW",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez payer 3 pour choisir un personnage ayant au moins un dommage sur lui et le bannir.",
      },
    ],
  },
  it: {
    name: "Scroop",
    version: "Ammutinato Detestabile",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "SALUTA IL SIGNOR ARROW DA PARTE MIA",
        description:
          "Quando giochi questo personaggio, puoi pagare 3 per esiliare un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
