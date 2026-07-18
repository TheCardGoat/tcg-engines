import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lookAtThisFamilyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Look at This Family",
    text: [
      {
        title: "Sing Together 7",
        description:
          "(Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Diese Familie",
    text: [
      {
        title:
          "<Gemeinsam singen> 7 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 7 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Schaue dir die obersten 5 Karten deines Decks an. Du darfst bis zu 2 Charakterkarten daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "On est une Famille",
    text: [
      {
        title:
          "<À l'unisson> 7 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 7 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Regardez les 5 premières cartes de votre pioche. Vous pouvez révéler jusqu'à 2 cartes Personnage parmi elles et les ajouter à votre main. Remettez le reste sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Questa Famiglia",
    text: [
      {
        title:
          "<Cantare Insieme> 7 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 7 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Guarda le prime 5 carte del tuo mazzo. Puoi rivelare fino a 2 carte personaggio e aggiungerle alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
  es: {
    name: "Mira esta familia",
    text: [
      {
        title: "Cantar juntos 7",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 7 o más puede {E} cantar esta canción gratis).",
      },
      {
        title:
          "Mira las 5 primeras cartas de tu mazo. Puedes revelar hasta 2 cartas de personaje y ponerlas en tu mano. Coloque el resto en el fondo de su plataforma en cualquier orden.",
      },
    ],
  },
};
