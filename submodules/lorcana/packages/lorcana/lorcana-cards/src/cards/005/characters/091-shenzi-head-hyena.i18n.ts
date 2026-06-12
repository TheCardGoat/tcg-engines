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
        title: "WARUM BLEIBT IHR NICHT ZUM ESSEN?",
        description: "Dieser Charakter erhält +1 für jede weitere Hyäne, die du im Spiel hast.",
      },
      {
        title: "WAS HABEN WIR DENN DA?",
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
        title: "RAVIES DE VOUS AVOIR À DÎNER",
        description:
          "Ce personnage gagne +1 pour chaque autre personnage Hyène que vous avez en jeu.",
      },
      {
        title: "TIENS TIENS TIENS...",
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
        title: "AVERVI PER CENA",
        description:
          "Questo personaggio riceve +1 per ogni altro personaggio Iena che hai in gioco.",
      },
      {
        title: "CHE COSA ABBIAMO QUI?",
        description:
          "Ogni volta che uno dei tuoi personaggi Iena sfida un personaggio danneggiato, ottieni 2 leggenda.",
      },
    ],
  },
};
