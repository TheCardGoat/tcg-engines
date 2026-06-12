import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const digALittleDeeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dig a Little Deeper",
    text: [
      {
        title: "Sing Together 8",
        description:
          "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Du musst nur tiefer in dir graben",
    text: "Gemeinsam singen 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Schaue dir die obersten 7 Karten deines Decks an. Nimm 2 davon auf deine Hand. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
  },
  fr: {
    name: "Creuse encore et encore",
    text: "À l'unisson 8 (Vous pouvez n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 8 ou plus pour chanter cette chanson gratuitement.) Regardez les 7 premières cartes de votre pioche. Ajoutez-en 2 à votre main, puis remettez le reste sous votre pioche, dans l'ordre de votre choix.",
  },
  it: {
    name: "Se Scaverai un Po' Più a Fondo",
    text: [
      {
        title: "Cantare Insieme 8",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può per cantare questa canzone gratis.) Guarda le prime 7 carte del tuo mazzo. Aggiungine 2 alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
