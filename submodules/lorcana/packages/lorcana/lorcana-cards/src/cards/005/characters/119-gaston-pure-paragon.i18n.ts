import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonPureParagonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Pure Paragon",
    text: [
      {
        title: "A MAN AMONG MEN!",
        description:
          "For each damaged character you have in play, you pay 2 {I} less to play this character.",
      },
      {
        title: "Rush",
      },
    ],
  },
  de: {
    name: "Gaston",
    version: "Redlich, solid, tadellos",
    text: [
      {
        title: "DER MANN UNTER DEN MÄNNERN!",
        description:
          "Für jeden beschädigten Charakter den du im Spiel hast, zahlst du 2 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Rasant",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Du chic et de la prestance",
    text: [
      {
        title: "LE PLUS CLASSE, C'EST GASTON!",
        description:
          "Jouer ce personnage vous coûte 2 de moins pour chacun de vos personnages ayant au moins un dommage sur lui.",
      },
      {
        title: "Charge",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Ganzo Più Ganzo",
    text: [
      {
        title: "L'UOMO PERFETTO!",
        description:
          "Per ogni personaggio danneggiato che hai in gioco, paga 2 in meno per giocare questo personaggio.",
      },
      {
        title: "Lesto",
      },
    ],
  },
};
