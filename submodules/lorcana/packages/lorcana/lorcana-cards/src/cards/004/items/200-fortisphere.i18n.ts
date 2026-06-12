import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fortisphereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fortisphere",
    text: [
      {
        title: "RESOURCEFUL",
        description: "When you play this item, you may draw a card.",
      },
      {
        title: "EXTRACT OF STEEL 1",
        description:
          "{I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Fortisphäre",
    text: [
      {
        title: "EINFALLSREICH",
        description: "Wenn du diesen Gegenstand ausspielst, darfst du 1 Karte ziehen.",
      },
      {
        title: "EXTRAKT AUS STAHL 1,",
        description:
          "Verbanne diesen Gegenstand — Wähle einen deiner Charaktere, er erhält bis zu Beginn deines nächsten Zuges Beschützen. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Sphère d'endurance",
    text: [
      {
        title: "PLEINE DE RESSOURCE",
        description: "Lorsque vous jouez cet objet, vous pouvez piocher une carte.",
      },
      {
        title: "EXTRAIT D'ACIER 1,",
        description:
          "Bannissez cet objet — Choisissez un de vos personnages qui gagne Rempart jusqu'au début de votre prochain tour. (Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Fortisfera",
    text: [
      {
        title: "PIENA DI RISORSE",
        description: "Quando giochi questo oggetto, puoi pescare una carta.",
      },
      {
        title: "ESTRATTO DI ACCIAIO 1,",
        description:
          "esilia questo oggetto — Un tuo personaggio a tua scelta ottiene Guardiano fino all'inizio del tuo prossimo turno. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
