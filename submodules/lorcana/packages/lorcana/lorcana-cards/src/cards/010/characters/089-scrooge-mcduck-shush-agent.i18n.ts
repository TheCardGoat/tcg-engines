import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckShushAgentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "S.H.U.S.H. Agent",
    text: [
      {
        title: "BACKUP PLAN",
        description: "When you play this character, draw a card, then choose and discard a card.",
      },
      {
        title: "ON THE MOVE",
        description:
          "When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "S.H.U.S.H.-Agent",
    text: [
      {
        title: "Notfallplan",
        description:
          "Wenn du diesen Charakter ausspielst, ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "In Bewegung",
        description:
          "Wenn dieser Charakter herausgefordert wird, nimm ihn zurück auf deine Hand. (Bevor der Schaden durch die Herausforderung berechnet wird.)",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Agent du C.H.U.T.",
    text: [
      {
        title: "Plan de secours",
        description: "Lorsque vous jouez ce personnage, piochez une carte puis défaussez-en une.",
      },
      {
        title: "En mouvement",
        description:
          "Chaque fois que ce personnage est défié, renvoyez cette carte dans votre main. (Aucun dommage n'est infligé lors de ce défi.)",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Agente S.H.U.S.H.",
    text: [
      {
        title: "Piano di Riserva",
        description:
          "Quando giochi questo personaggio, pesca una carta, poi scegli e scarta una carta.",
      },
      {
        title: "In Movimento",
        description:
          "Quando questo personaggio viene sfidato, riprendi in mano questa carta. (Nessun danno viene inflitto in quella sfida.)",
      },
    ],
  },
};
