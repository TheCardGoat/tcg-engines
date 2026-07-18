import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const withAFewGoodFriendsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "With a Few Good Friends",
    text: [
      {
        title: "Sing Together 6",
        description:
          "(Any number of your or your teammates' characters with total cost 6 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Chosen player draws a card for each different ink type of characters you have in play.",
      },
    ],
  },
  de: {
    name: "Mit 'nem guten Freund",
    text: [
      {
        title:
          "<Gemeinsam singen> 6 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 6 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Eine Person deiner Wahl zieht 1 Karte für jede unterschiedliche Tintenfarbe deiner Charaktere im Spiel.",
      },
    ],
  },
  fr: {
    name: "Deux trois bons amis",
    text: [
      {
        title:
          "<À l'unisson> 6 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un joueur qui pioche une carte pour chaque couleur d'encre différente figurant sur les personnages que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Stando in Compagnia",
    text: [
      {
        title:
          "<Cantare Insieme> 6 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un giocatore a tua scelta pesca una carta per ogni tipo diverso di inchiostro dei personaggi che hai in gioco.",
      },
    ],
  },
  es: {
    name: "Con algunos buenos amigos",
    text: [
      {
        title: "Cantar juntos 6",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 6 o más puede {E} cantar esta canción gratis).",
      },
      {
        title:
          "El jugador elegido roba una carta por cada tipo de tinta diferente de personaje que tengas en juego.",
      },
    ],
  },
};
