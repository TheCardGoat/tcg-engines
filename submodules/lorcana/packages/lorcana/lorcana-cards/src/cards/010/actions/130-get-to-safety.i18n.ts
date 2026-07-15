import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const getToSafetyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Get to Safety!",
    text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
  },
  de: {
    name: "Bring dich in Sicherheit!",
    text: "Spiele eine Ortskarte aus deinem Ablagestapel, die 3 oder weniger kostet, kostenlos aus. Falls du danach einen Sleepy-Hollow-Ort im Spiel hast, ziehe 1 Karte.",
  },
  fr: {
    name: "Vite, à l'abri !",
    text: "Jouez gratuitement un lieu de votre défausse coûtant 3 ou moins. Ensuite, si vous avez un lieu nommé Sleepy Hollow en jeu, piochez une carte.",
  },
  it: {
    name: "Mettiti in Salvo!",
    text: "Gioca un luogo con costo 3 o inferiore dai tuoi scarti gratis. Poi, se hai in gioco un luogo chiamato La Valle Addormentata, pesca una carta.",
  },
};
