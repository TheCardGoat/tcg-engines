import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinsBowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin's Bow",
    text: [
      {
        title: "FOREST'S GIFT",
        description: "{E} — Deal 1 damage to chosen damaged character or location.",
      },
      {
        title: "A BIT OF A LARK",
        description:
          "Whenever a character of yours named Robin Hood quests, you may ready this item.",
      },
    ],
  },
  de: {
    name: "Robins Bogen",
    text: [
      {
        title: "Geschenk des Waldes",
        description: "{E} — Füge einem beschädigten Charakter oder Ort deiner Wahl 1 Schaden zu.",
      },
      {
        title: "Ich fand das eben ganz lustig",
        description:
          "Jedes Mal, wenn einer deiner Robin-Hood-Charaktere erkundet, darfst du diesen Gegenstand bereit machen.",
      },
    ],
  },
  fr: {
    name: "Arc de Robin",
    text: [
      {
        title: "Don de la forêt",
        description:
          "{E} — Choisissez un personnage blessé ou un lieu endommagé et infligez-lui 1 dommage.",
      },
      {
        title: "Une bouffonnerie",
        description:
          "Chaque fois que l'un de vos personnages Robin des Bois est envoyé à l'aventure, vous pouvez redresser cet objet.",
      },
    ],
  },
  it: {
    name: "Arco di Robin",
    text: [
      {
        title: "Dono della Foresta",
        description:
          "{E} — Infliggi 1 danno a un personaggio o a un luogo già danneggiato a tua scelta.",
      },
      {
        title: "È Stata una Sciocchezzuola",
        description:
          "Ogni volta che un tuo personaggio chiamato Robin Hood va all'avventura, puoi preparare questo oggetto.",
      },
    ],
  },
  es: {
    name: "El arco de Robin",
    text: [
      {
        title: "EL REGALO DEL BOSQUE",
        description: "{E}: inflige 1 daño al personaje o ubicación dañado elegido.",
      },
      {
        title: "UN POCO DE ALONDRA",
        description:
          "Siempre que un personaje tuyo llamado Robin Hood realice misiones, puedes preparar este objeto.",
      },
    ],
  },
};
