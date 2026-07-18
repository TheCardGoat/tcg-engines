import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonPureParagonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Pure Paragon",
    text: [
      {
        title:
          "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.",
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
        title: "Der Mann unter den Männern!",
        description:
          "Für jeden beschädigten Charakter den du im Spiel hast, zahlst du 2 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "<Rasant>",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Du chic et de la prestance",
    text: [
      {
        title: "Le plus classe, c'est Gaston!",
        description:
          "Jouer ce personnage vous coûte 2 {I} de moins pour chacun de vos personnages ayant au moins un dommage sur lui.",
      },
      {
        title: "<Charge>",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Ganzo Più Ganzo",
    text: [
      {
        title: "L'Uomo Perfetto!",
        description:
          "Per ogni personaggio danneggiato che hai in gioco, paga 2 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
  es: {
    name: "Gastón",
    version: "Modelo puro",
    text: [
      {
        title:
          "¡UN HOMBRE ENTRE HOMBRES! Por cada personaje dañado que tengas en juego, pagas 2 {I} menos para interpretar a este personaje.",
      },
      {
        title: "Correr",
      },
    ],
  },
};
