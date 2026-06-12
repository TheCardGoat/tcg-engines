import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const containmentUnitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Containment Unit",
    text: [
      {
        title: "GOT YOU NOW",
        description:
          "When you play this item, choose a character. They can't challenge or quest while this item is in play.",
      },
      {
        title: "POWER SUPPLY",
        description: "At the start of your turn, choose and discard a card or banish this item.",
      },
    ],
  },
  de: {
    name: "Experimentkapsel",
    text: [
      {
        title: "ENDLICH HAB ICH DICH",
        description:
          "Wenn du diesen Gegenstand ausspielst, wähle einen Charakter. Er kann nicht mehr erkunden oder herausfordern, solange dieser Gegenstand im Spiel ist.",
      },
      {
        title: "STROMVERSORGUNG",
        description:
          "Zu Beginn deines Zuges, wähle eine Karte aus deiner Hand und wirf sie ab oder verbanne diesen Gegenstand.",
      },
    ],
  },
  fr: {
    name: "Unité de confinement",
    text: [
      {
        title: "JE T'AI ATTRAPÉ",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage. Il ne peut pas défier ou être envoyé à l'aventure tant que cet objet est en jeu.",
      },
      {
        title: "SOURCE D'ÉNERGIE",
        description: "Au début de votre tour, défaussez une carte ou bannissez cet objet.",
      },
    ],
  },
  it: {
    name: "Unità di Contenimento",
    text: [
      {
        title: "ADESSO TI HO PRESO",
        description:
          "Quando giochi questo oggetto, scegli un personaggio. Non può sfidare o andare all'avventura mentre questo oggetto è in gioco.",
      },
      {
        title: "FONTE DI ENERGIA",
        description: "All'inizio del tuo turno, scegli e scarta una carta o esilia questo oggetto.",
      },
    ],
  },
};
