import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const baymaxUpgradedRobotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baymax",
    version: "Upgraded Robot",
    text: [
      {
        title: "Support",
      },
      {
        title: "ADVANCED SCANNER",
        description:
          "When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Baymax",
    version: "Aufgerüsteter Roboter",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Erweiterter Scanner",
        description:
          "Wenn du diesen Charakter ausspielst, schaue dir die obersten 4 Karten deines Decks an. Du darfst 1 Flutgestalt-Charakterkarte daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Baymax",
    version: "Robot amélioré",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Super capteur",
        description:
          "Lorsque vous jouez ce personnage, regardez les 4 cartes du dessus de votre pioche. Vous pouvez révéler un personnage Floodborn parmi elles et le placer dans votre main. Placez les autres cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Baymax",
    version: "Robot Potenziato",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Scanner Avanzato",
        description:
          "Quando giochi questo personaggio, guarda le prime 4 carte del tuo mazzo. Puoi rivelare una carta personaggio Imbevuto e aggiungerla alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
  es: {
    name: "Baymax",
    version: "Robot mejorado",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "ESCÁNER AVANZADO",
        description:
          "Cuando juegues con este personaje, mira las 4 cartas superiores de tu mazo. Puedes revelar una carta de personaje Floodborn y ponerla en tu mano. Coloque el resto en el fondo de su plataforma en cualquier orden.",
      },
    ],
  },
};
