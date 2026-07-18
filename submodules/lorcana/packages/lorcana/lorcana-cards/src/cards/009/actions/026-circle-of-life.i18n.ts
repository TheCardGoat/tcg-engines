import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const circleOfLifeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Circle of Life",
    text: [
      {
        title: "Sing Together 8",
        description:
          "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.) Play a character from your discard for free.",
      },
    ],
  },
  de: {
    name: "Der ewige Kreis",
    text: [
      {
        title:
          "<Gemeinsam singen> 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Spiele eine Charakterkarte kostenlos aus deinem Ablagestapel aus.",
      },
    ],
  },
  fr: {
    name: "L'histoire de la vie",
    text: [
      {
        title: "<À l'unisson> 8",
      },
      {
        title: "Jouez gratuitement un personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "Il Cerchio della Vita",
    text: [
      {
        title:
          "<Cantare Insieme> 8 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Gioca un personaggio dai tuoi scarti gratis.",
      },
    ],
  },
  es: {
    name: "Círculo de la vida",
    text: [
      {
        title: "Cantar juntos 8",
        description:
          "(Cualquier cantidad de personajes tuyos o de tus compañeros de equipo con un costo total de 8 o más puede {E} cantar esta canción gratis). Juega con un personaje de tu descarte de forma gratuita.",
      },
    ],
  },
};
