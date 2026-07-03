import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const digALittleDeeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dig a Little Deeper",
    text: [
      {
        title: "Sing Together 8",
        description:
          "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.) Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Du musst nur tiefer in dir graben",
    text: [
      {
        title:
          "<Gemeinsam singen> 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Schaue dir die obersten 7 Karten deines Decks an. Nimm 2 davon auf deine Hand. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Creuse encore et encore",
    text: [
      {
        title:
          "<À l'unisson> 8 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 8 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Regardez les 7 premières cartes de votre pioche. Ajoutez-en 2 à votre main, puis remettez le reste sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Se Scaverai un Po' Più a Fondo",
    text: [
      {
        title:
          "<Cantare Insieme> 8 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Guarda le prime 7 carte del tuo mazzo. Aggiungine 2 alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
