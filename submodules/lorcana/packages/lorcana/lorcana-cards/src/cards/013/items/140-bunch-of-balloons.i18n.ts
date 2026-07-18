import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bunchOfBalloonsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bunch of Balloons",
    text: [
      {
        title: "Float Away",
        description:
          "When you play this item, choose a location of yours. While this item is in play, that location gains <Evasive>. (Only characters with Evasive can challenge it.)",
      },
      {
        title: "Out of Sight",
        description: "3 {I} — Return this item to your hand.",
      },
    ],
  },
  de: {
    name: "Eine Menge Luftballons",
    text: [
      {
        title: "Wegschweben",
        description:
          "Wenn du diesen Gegenstand ausspielst, wähle einen deiner Orte. Solange dieser Gegenstand im Spiel ist, erhält jener Ort <Wendig>. (Nur Charaktere mit Wendig können den Ort herausfordern.)",
      },
      {
        title: "Außer Sichtweite",
        description: "3 {I} — Nimm diesen Gegenstand zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Grappe de ballons",
    text: [
      {
        title: "S'envoler",
        description:
          "Lorsque vous jouez cet objet, choisissez l'un de vos lieux. Tant que cet objet est en jeu, le lieu ainsi choisi gagne <Insaisissable>. (Seuls les personnages avec Insaisissable peuvent le défier.)",
      },
      {
        title: "Hors de vue",
        description: "3 {I} — Renvoyez cet objet dans votre main.",
      },
    ],
  },
  it: {
    name: "Mucchio di Palloncini",
    text: [
      {
        title: "Volare Via",
        description:
          "Quando giochi questo oggetto, scegli un tuo luogo. Mentre questo oggetto è in gioco, quel luogo ottiene <Sfuggente>. (Solo i personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "Non Più in Vista",
        description: "3 {I} — Riprendi in mano questo oggetto.",
      },
    ],
  },
  es: {
    name: "Manojo de globos",
    text: [
      {
        title: "Flotar lejos",
        description:
          "Cuando juegues este objeto, elige una ubicación tuya. Mientras este objeto esté en juego, esa ubicación gana <Evasivo>. (Solo los personajes con Evasivo pueden desafiarlo).",
      },
      {
        title: "Fuera de la vista",
        description: "3 {I} — Devuelve este objeto a tu mano.",
      },
    ],
  },
};
