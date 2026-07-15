import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const secondStarToTheRightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Second Star to the Right",
    text: [
      {
        title: "Sing Together 10",
        description:
          "(Any number of your or your teammates' characters with total cost 10 or more may {E} to sing this song for free.)",
      },
      {
        title: "Chosen player draws 5 cards.",
      },
    ],
  },
  de: {
    name: "Der Kleine Stern Naseweis",
    text: [
      {
        title:
          "<Gemeinsam singen> 10 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 10 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Eine Person deiner Wahl zieht 5 Karten.",
      },
    ],
  },
  fr: {
    name: "La Deuxième Étoile sur la Droite",
    text: [
      {
        title:
          "<À l'unisson> 10 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 10 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un joueur qui pioche 5 cartes.",
      },
    ],
  },
  it: {
    name: "Ci Son Due Stelle nel Ciel",
    text: [
      {
        title:
          "<Cantare Insieme> 10 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 10 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Un giocatore a tua scelta pesca 5 carte.",
      },
    ],
  },
};
