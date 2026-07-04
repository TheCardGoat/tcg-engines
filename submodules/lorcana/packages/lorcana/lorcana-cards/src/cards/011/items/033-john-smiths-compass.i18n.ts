import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSmithsCompassI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Smith's Compass",
    text: [
      {
        title: "SPINNING ARROW",
        description:
          "At the end of your turn, if a character of yours challenged this turn, banish this item.",
      },
      {
        title: "YOUR PATH",
        description:
          "At the end of your turn, if none of your characters challenged this turn, reveal the top card of your deck. If it's a character card with cost 3 or less or named Pocahontas, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "John Smiths Kompass",
    text: [
      {
        title: "Der kreisende Pfeil",
        description:
          "Am Ende deines Zuges, falls einer deiner Charaktere in diesem Zug herausgefordert hat, verbanne diesen Gegenstand.",
      },
      {
        title: "Dein Weg",
        description:
          "Am Ende deines Zuges, falls in diesem Zug noch keiner deiner Charaktere herausgefordert hat, decke die oberste Karte deines Decks auf. Falls sie eine Charakterkarte ist, die 3 oder weniger kostet, oder falls sie eine Pocahontas-Charakterkarte ist, darfst du sie auf deine Hand nehmen. Falls nicht, lege sie unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Boussole de John Smith",
    text: [
      {
        title: "Cette flèche qui tourne",
        description:
          "À la fin de votre tour, si l'un de vos personnages a défié ce tour-ci, bannissez cet objet.",
      },
      {
        title: "Le droit chemin",
        description:
          "À la fin de votre tour, si aucun de vos personnages n'a défié ce tour-ci, révélez la carte du dessus de votre pioche. S'il s'agit d'une carte Personnage coûtant 3 ou moins ou qu'elle est nommée Pocahontas, vous pouvez l'ajouter à votre main. Sinon, placez-la sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Bussola di John Smith",
    text: [
      {
        title: "Freccia Che Ruota",
        description:
          "Alla fine del tuo turno, se un tuo personaggio ha sfidato in questo turno, esilia questo oggetto.",
      },
      {
        title: "La tua Via",
        description:
          "Alla fine del tuo turno, se nessuno dei tuoi personaggi ha sfidato in questo turno, rivela la prima carta del tuo mazzo. Se è una carta personaggio con costo 3 o inferiore o se si chiama Pocahontas, puoi aggiungerla alla tua mano. Altrimenti, mettila in fondo al tuo mazzo.",
      },
    ],
  },
};
