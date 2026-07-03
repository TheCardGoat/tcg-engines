import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jasmineSoothingPrincessP3PromoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jasmine",
    version: "Soothing Princess",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "UPLIFTING AURA",
        description:
          "Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.",
      },
    ],
  },
  de: {
    name: "Jasmin",
    version: "Beruhigende Prinzessin",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Aufmunternde Aura",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls er mindestens eine Karte unter sich hat, entferne bis zu 3 Schaden von jedem deiner Charaktere.",
      },
    ],
  },
  fr: {
    name: "Jasmine",
    version: "Princesse apaisante",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Aura revigorante",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, s'il y a une carte sous lui, retirez jusqu'à 3 dommages de chacun de vos personnages.",
      },
    ],
  },
  it: {
    name: "Jasmine",
    version: "Principessa Confortante",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Aura Incoraggiante",
        description:
          "Ogni volta che questo personaggio va all'avventura, se c'è una carta sotto di esso, rimuovi fino a 3 danni da ogni tuo personaggio.",
      },
    ],
  },
};
