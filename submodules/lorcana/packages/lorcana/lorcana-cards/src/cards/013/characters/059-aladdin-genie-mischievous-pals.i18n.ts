import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinGenieMischievousPalsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin & Genie",
    version: "Mischievous Pals",
    text: [
      {
        title: "Shift 3",
        description:
          "(You may pay 3 to play this on top of one of your characters named Aladdin or Genie.)",
      },
      {
        title: "SLEIGHT OF HAND",
        description:
          "When you play this character, you may put any number of cards from your hand on the bottom of your deck in any order. If you do, draw that number of cards plus 1.",
      },
    ],
  },
  de: {
    name: "Aladdin & Dschinni",
    version: "Schelmische Freunde",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Aladdin oder Dschinni auszuspielen.)",
      },
      {
        title: "Trickbetrug",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du beliebig viele Karten von deiner Hand in beliebiger Reihenfolge unter dein Deck legen. Wenn du dies tust, ziehe dieselbe Anzahl Karten, wie du weggelegt hast, plus 1.",
      },
    ],
  },
  fr: {
    name: "Aladdin & Génie",
    version: "Potes facétieux",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Aladdin ou Génie.)",
      },
      {
        title: "Tour de passe-passe",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez placer n'importe quel nombre de cartes de votre main sous votre pioche, dans l'ordre de votre choix. Si vous le faites, piochez autant de cartes, plus 1.",
      },
    ],
  },
  it: {
    name: "Aladdin e Genio",
    version: "Amici Dispettosi",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Aladdin o Genio.)",
      },
      {
        title: "Gioco di Prestigio",
        description:
          "Quando giochi questo personaggio, puoi mettere un qualsiasi numero di carte dalla tua mano in fondo al tuo mazzo in qualsiasi ordine. Se lo fai, pesca lo stesso numero di carte più 1.",
      },
    ],
  },
};
