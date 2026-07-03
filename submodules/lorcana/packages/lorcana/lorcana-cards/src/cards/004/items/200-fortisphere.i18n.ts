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
        title: "Einfallsreich",
        description: "Wenn du diesen Gegenstand ausspielst, darfst du 1 Karte ziehen.",
      },
      {
        title: "Extrakt aus Stahl",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Wähle einen deiner Charaktere, er erhält bis zu Beginn deines nächsten Zuges <Beschützen>. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Sphère d'endurance",
    text: [
      {
        title: "Pleine de ressource",
        description: "Lorsque vous jouez cet objet, vous pouvez piocher une carte.",
      },
      {
        title: "Extrait d'acier",
        description:
          "1 {I}, Bannissez cet objet — Choisissez un de vos personnages qui gagne <Rempart> jusqu'au début de votre prochain tour. (Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Fortisfera",
    text: [
      {
        title: "Piena di Risorse",
        description: "Quando giochi questo oggetto, puoi pescare una carta.",
      },
      {
        title: "Estratto di Acciaio",
        description:
          "1 {I}, esilia questo oggetto — Un tuo personaggio a tua scelta ottiene <Guardiano> fino all'inizio del tuo prossimo turno. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
