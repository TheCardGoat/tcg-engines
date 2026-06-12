import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stoppedChaosInItsTracksI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stopped Chaos in Its Tracks",
    text: [
      {
        title: "Sing Together 8",
        description:
          "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
      },
      {
        title: "Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
      },
    ],
  },
  de: {
    name: "Alles Böse biss dabei ins Gras",
    text: "Gemeinsam singen 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Schicke bis zu 2 Charaktere deiner Wahl mit je 3 oder weniger auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "Foudroyant d'un éclair ces brutes",
    text: "À l'unisson 8 (Vous pouvez n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 8 ou plus pour chanter cette chanson gratuitement.) Choisissez jusqu'à 2 personnages avec 3 ou moins et renvoyez-les dans la main de leur propriétaire.",
  },
  it: {
    name: "Tutto Tornò Tranquillo Come Mai",
    text: [
      {
        title: "Cantare Insieme 8",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può per cantare questa canzone gratis.) Fai riprendere in mano al suo giocatore fino a 2 personaggi a tua scelta con 3 o inferiore ciascuno.",
      },
    ],
  },
};
