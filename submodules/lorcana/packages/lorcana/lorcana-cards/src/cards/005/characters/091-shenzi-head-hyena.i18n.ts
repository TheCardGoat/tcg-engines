import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shenziHeadHyenaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shenzi",
    version: "Head Hyena",
    text: [
      {
        title: "STICK AROUND FOR DINNER",
        description: "This character gets +1 {S} for each other Hyena character you have in play.",
      },
      {
        title: "WHAT HAVE WE GOT HERE?",
        description:
          "Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Shenzi",
    version: "Leithyäne",
    text: [
      {
        title: "Warum bleibt ihr nicht zum Essen?",
        description: "Dieser Charakter erhält +1 {S} für jede weitere Hyäne, die du im Spiel hast.",
      },
      {
        title: "Was haben wir denn da?",
        description:
          "Jedes Mal, wenn eine deiner Hyänen einen beschädigten Charakter herausfordert, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Shenzi",
    version: "Meneuse des hyènes",
    text: [
      {
        title: "Ravies de vous avoir à dîner",
        description:
          "Ce personnage gagne +1 {S} pour chaque autre personnage Hyène que vous avez en jeu.",
      },
      {
        title: "Tiens tiens tiens...",
        description:
          "Chaque fois que l'un de vos personnages Hyène défie un personnage ayant au moins un dommage sur lui, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Shenzi",
    version: "Capo Iena",
    text: [
      {
        title: "Avervi per Cena",
        description:
          "Questo personaggio riceve +1 {S} per ogni altro personaggio Iena che hai in gioco.",
      },
      {
        title: "Che Cosa Abbiamo Qui?",
        description:
          "Ogni volta che uno dei tuoi personaggi Iena sfida un personaggio danneggiato, ottieni 2 leggenda.",
      },
    ],
  },
  es: {
    name: "Shenzi",
    version: "Hiena cabeza",
    text: [
      {
        title: "Quédate para cenar",
        description:
          "Este personaje obtiene +1 {S} por cada otro personaje de Hiena que tengas en juego.",
      },
      {
        title: "¿QUÉ TENEMOS AQUÍ?",
        description:
          "Siempre que uno de tus personajes Hiena desafíe a un personaje dañado, gana 2 conocimientos.",
      },
    ],
  },
};
