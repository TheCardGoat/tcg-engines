import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hadesDoubleDealerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hades",
    version: "Double Dealer",
    text: [
      {
        title: "HERE'S THE TRADE-OFF",
        description:
          "{E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
      },
    ],
  },
  de: {
    name: "Hades",
    version: "Falsches Spiel",
    text: [
      {
        title: "NUN ZUM",
        description:
          "GESCHÄFT, Verbanne einen deiner anderen Charaktere — Spiele einen Charakter mit demselben Namen wie der verbannte Charakter, kostenlos aus.",
      },
    ],
  },
  fr: {
    name: "Hadès",
    version: "Double jeu",
    text: [
      {
        title: "VOILÀ LE MARCHÉ,",
        description:
          "Bannissez l'un de vos autres personnages — Jouez gratuitement un personnage de votre main portant le même nom que le personnage banni.",
      },
    ],
  },
  it: {
    name: "Ade",
    version: "Doppiogiochista",
    text: [
      {
        title: "FACCIAMO UNO SCAMBIO,",
        description:
          "esilia uno dei tuoi altri personaggi — Gioca un personaggio con lo stesso nome di quello che hai esiliato, gratis.",
      },
    ],
  },
};
