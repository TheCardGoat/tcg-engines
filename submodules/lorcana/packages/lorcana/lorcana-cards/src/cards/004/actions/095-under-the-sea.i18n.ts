import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const underTheSeaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Under the Sea",
    text: [
      {
        title: "Sing Together 8",
        description:
          "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
      },
    ],
  },
  de: {
    name: "Unten im Meer",
    text: "Gemeinsam singen 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Lege alle gegnerischen Charaktere mit 2 oder weniger in beliebiger Reihenfolge unter die jeweiligen Decks.",
  },
  fr: {
    name: "Sous l'océan",
    text: "À l'unisson 8 (Vous pouvez n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 8 ou plus pour chanter cette chanson gratuitement.) Remettez tous les personnages adverses avec 2 ou moins sous la pioche de leur propriétaire, dans l'ordre de votre choix.",
  },
  it: {
    name: "In Fondo al Mar",
    text: [
      {
        title: "Cantare Insieme 8",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può per cantare questa canzone gratis.) Metti tutti i personaggi avversari con 2 o inferiore in fondo al mazzo dei loro giocatori, in qualsiasi ordine.",
      },
    ],
  },
};
