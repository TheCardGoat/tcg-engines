import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const itMeansNoWorriesEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "It Means No Worries",
    text: [
      {
        title: "Sing Together 9",
        description:
          "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Die Sorgen bleiben dir immer fern",
    text: [
      {
        title:
          "<Gemeinsam singen> 9 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 9 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Nimm bis zu 3 Charakterkarten aus deinem Ablagestapel zurück auf deine Hand. Du zahlst 2 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Sans aucun souci",
    text: [
      {
        title:
          "<À l'unisson> 9 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 9 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Renvoyez dans votre main jusqu'à 3 cartes Personnage de votre défausse. Le prochain personnage que vous jouez ce tour-ci vous coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Senza Pensieri",
    text: [
      {
        title:
          "<Cantare Insieme> 9 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 9 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Riprendi in mano fino a 3 carte personaggio dai tuoi scarti. Paga 2 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
  es: {
    name: "Significa que no hay preocupaciones",
    text: [
      {
        title: "Cantar juntos 9",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 9 o más puede {E} cantar esta canción gratis).",
      },
      {
        title:
          "Devuelve a tu mano hasta 3 cartas de personaje de tu descarte. Pagas 2 {I} menos por el siguiente personaje que juegues en este turno.",
      },
    ],
  },
};
