import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const headsHeldHighI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heads Held High",
    text: [
      {
        title: "Sing Together 6",
        description:
          "(Any number of your or your teammates' characters with total cost 6 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Himmelwärts jauchzt das Herz",
    text: [
      {
        title:
          "<Gemeinsam singen> 6 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 6 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Entferne bis zu 3 Schaden von beliebig vielen Charakteren deiner Wahl. Gib allen gegnerischen Charakteren in diesem Zug -3 {S}.",
      },
    ],
  },
  fr: {
    name: "Nous sommes là pour vous aider",
    text: [
      {
        title:
          "<À l'unisson> 6 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez n'importe quel nombre de personnages et retirez jusqu'à 3 dommages de chacun. Tous les personnages adverses subissent -3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Petto in Fuor",
    text: [
      {
        title:
          "<Cantare Insieme> 6 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Rimuovi fino a 3 danni da un qualsiasi numero di personaggi a tua scelta. Tutti i personaggi avversari ricevono -3 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Cabezas en alto",
    text: [
      {
        title: "Cantar juntos 6",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 6 o más puede {E} cantar esta canción gratis).",
      },
      {
        title:
          "Elimina hasta 3 daños de cualquier número de personajes elegidos. Todos los personajes contrarios obtienen -3 {S} este turno.",
      },
    ],
  },
};
