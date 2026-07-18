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
        title: "Spur der Zerstörung",
        description:
          "Für jede Gegenstandskarte in deinem Ablagestapel zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Kollateralschaden",
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
        title: "Sillage de destruction",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins pour chaque carte Objet dans votre défausse.",
      },
      {
        title: "Dommage collatéral",
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
        title: "Scia di Distruzione",
        description:
          "Per ogni carta oggetto nei tuoi scarti, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Danno Collaterale",
        description:
          "Quando giochi questo personaggio, puoi mettere 3 carte oggetto dai tuoi scarti in fondo al tuo mazzo in qualsiasi ordine. Se lo fai, infliggi 3 danni a un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "Stegmutt",
    version: "Dinosaurio torpe",
    text: [
      {
        title: "DESPERTAR DE LA DESTRUCCIÓN",
        description:
          "Por cada carta de objeto de tu descarte, pagas 1 {I} menos para jugar con este personaje.",
      },
      {
        title: "DAÑO COLATERAL",
        description:
          "Cuando juegas con este personaje, puedes colocar 3 cartas de elementos de tu descarte en la parte inferior de tu mazo en cualquier orden. Si lo haces, inflige 3 daños al personaje elegido.",
      },
    ],
  },
};
