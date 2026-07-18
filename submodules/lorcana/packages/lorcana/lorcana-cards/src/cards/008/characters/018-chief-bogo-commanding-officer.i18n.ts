import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chiefBogoCommandingOfficerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chief Bogo",
    version: "Commanding Officer",
    text: [
      {
        title: "SENDING BACKUP",
        description:
          "During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Chief Bogo",
    version: "Befehlshaber",
    text: [
      {
        title: "Sendet Verstärkung",
        description:
          "Jedes Mal, wenn einer deiner Charaktere mit <Beschützen> im Zug einer gegnerischen Person verbannt wird, darfst du die oberste Karte deines Decks aufdecken. Falls sie eine Charakterkarte ist, die 5 oder weniger kostet, darfst du sie kostenlos ausspielen. Falls nicht, lege sie zurück auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Chef Bogo",
    version: "Officier au commandement",
    text: [
      {
        title: "Envoi de renforts",
        description:
          "Durant le tour d'un adversaire, chaque fois que l'un de vos personnages avec <Rempart> est banni, vous pouvez révéler la carte du dessus de votre pioche. S'il s'agit d'une carte Personnage avec un coût de 5 ou moins, vous pouvez la jouer gratuitement. Sinon, replacez-la sur votre pioche.",
      },
    ],
  },
  it: {
    name: "Capitano Bogo",
    version: "Ufficiale di Comando",
    text: [
      {
        title: "Inviare Rinforzi",
        description:
          "Durante il turno di un avversario, ogni volta che uno dei tuoi personaggi con <Guardiano> viene esiliato, puoi rivelare la prima carta del tuo mazzo. Se è una carta personaggio con costo 5 o inferiore, puoi giocare quel personaggio gratis. Altrimenti, rimettila in cima al tuo mazzo.",
      },
    ],
  },
  es: {
    name: "Jefe bogo",
    version: "Oficial al mando",
    text: [
      {
        title: "ENVIANDO RESPALDO",
        description:
          "Durante el turno de un oponente, siempre que uno de tus personajes con Bodyguard sea desterrado, puedes revelar la carta superior de tu mazo. Si es una carta de personaje con un coste de 5 o menos, puedes jugar con ese personaje gratis. De lo contrario, colóquelo en la parte superior de su plataforma.",
      },
    ],
  },
};
