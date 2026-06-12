import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tianaRestaurantOwnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiana",
    version: "Restaurant Owner",
    text: [
      {
        title: "SPECIAL RESERVATION",
        description:
          "Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
      },
    ],
  },
  de: {
    name: "Tiana",
    version: "Restaurantbesitzerin",
    text: [
      {
        title: "SPEZIALRESERVIERUNG",
        description:
          "Jedes Mal, wenn einer deiner Charaktere herausgefordert wird, solange dieser Charakter erschöpft ist, erhält der herausfordernde Charakter in diesem Zug -3, falls die ihm zugehörige Person nicht 3 bezahlt.",
      },
    ],
  },
  fr: {
    name: "Tiana",
    version: "Propriétaire de restaurant",
    text: [
      {
        title: "RÉSERVATION SPÉCIALE",
        description:
          "Tant que ce personnage est épuisé, chaque fois que l'un de vos personnages est défié, le personnage qui défie subit -3 pour le reste de ce tour à moins que son propriétaire ne paie 3.",
      },
    ],
  },
  it: {
    name: "Tiana",
    version: "Proprietaria di Ristorante",
    text: [
      {
        title: "PRENOTAZIONE SPECIALE",
        description:
          "Ogni volta che un tuo personaggio viene sfidato mentre questo personaggio è impegnato, il personaggio sfidante riceve -3 per questo turno a meno che il suo giocatore non paghi 3.",
      },
    ],
  },
};
