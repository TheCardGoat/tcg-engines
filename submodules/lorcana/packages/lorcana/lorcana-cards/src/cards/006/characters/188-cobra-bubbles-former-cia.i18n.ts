import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cobraBubblesFormerCiaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cobra Bubbles",
    version: "Former CIA",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "THINK ABOUT WHAT'S BEST 2",
        description: "{I} — Draw a card, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Cobra Bobo",
    version: "Ehemaliger Mitarbeiter der CIA",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Überlege, was das beste ist",
        description: "2 {I} — Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Cobra Bubbles",
    version: "Ancien agent de la CIA",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Envisager ce qu'il y a de mieux",
        description: "2 {I} — Piochez une carte puis défaussez-en une.",
      },
    ],
  },
  it: {
    name: "Cobra Bubbles",
    version: "Ex Agente CIA",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Considerare quello che è meglio",
        description: "2 {I} — Pesca una carta, poi scegli e scarta una carta.",
      },
    ],
  },
};
