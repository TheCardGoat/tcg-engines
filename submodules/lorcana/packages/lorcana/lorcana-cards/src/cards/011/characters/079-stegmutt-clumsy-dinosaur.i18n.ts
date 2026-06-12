import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stegmuttClumsyDinosaurI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stegmutt",
    version: "Clumsy Dinosaur",
    text: [
      {
        title: "WAKE OF DESTRUCTION",
        description:
          "For each item card in your discard, you pay 1 {I} less to play this character.",
      },
      {
        title: "COLLATERAL DAMAGE",
        description:
          "When you play this character, you may put 3 item cards from your discard on the bottom of your deck in any order. If you do, deal 3 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Stegmann",
    version: "Tollpatschiger Dinosaurier",
    text: [
      {
        title: "SPUR DER ZERSTÖRUNG",
        description:
          "Für jede Gegenstandskarte in deinem Ablagestapel zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "KOLLATERALSCHADEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 3 Gegenstandskarten aus deinem Ablagestapel in beliebiger Reihenfolge unter dein Deck legen. Wenn du dies tust, füge einem Charakter deiner Wahl 3 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Sigmund",
    version: "Dinosaure maladroit",
    text: [
      {
        title: "SILLAGE DE DESTRUCTION",
        description:
          "Jouer ce personnage vous coûte 1 de moins pour chaque carte Objet dans votre défausse.",
      },
      {
        title: "DOMMAGE COLLATÉRAL",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez placer 3 cartes Objet de votre défausse sous votre pioche dans l'ordre de votre choix. Si vous le faites, choisissez un personnage et infligez-lui 3 dommages.",
      },
    ],
  },
  it: {
    name: "Stego",
    version: "Goffo Dinosauro",
    text: [
      {
        title: "SCIA DI DISTRUZIONE",
        description:
          "Per ogni carta oggetto nei tuoi scarti, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "DANNO COLLATERALE",
        description:
          "Quando giochi questo personaggio, puoi mettere 3 carte oggetto dai tuoi scarti in fondo al tuo mazzo in qualsiasi ordine. Se lo fai, infliggi 3 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
