import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const redMoonRitualI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Red Moon Ritual",
    text: [
      {
        title: "Sing Together 7",
        description:
          "(Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)",
      },
      {
        title: "Banish chosen character.",
      },
    ],
  },
  de: {
    name: "Roter-Mond-Ritual",
    text: [
      {
        title:
          "<Gemeinsam singen> 7 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 7 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Verbanne einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Rituel de la Lune Rouge",
    text: [
      {
        title:
          "<À l'unisson> 7 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 7 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Rituale della Luna Rossa",
    text: [
      {
        title:
          "<Cantare Insieme> 7 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 7 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Esilia un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "Ritual de la Luna Roja",
    text: [
      {
        title: "Cantar juntos 7",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 7 o más puede {E} cantar esta canción gratis).",
      },
      {
        title: "Desterrar al personaje elegido.",
      },
    ],
  },
};
