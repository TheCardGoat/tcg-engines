import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckParanormalInvestigator: CharacterCard = {
  id: "1pp",
  cardType: "character",
  name: "Daisy Duck",
  version: "Paranormal Investigator",
  fullName: "Daisy Duck - Paranormal Investigator",
  inkType: ["sapphire"],
  set: "010",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Daisy Duck.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 154,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de6a595285baab6c696be402cabc1e2f72843de3",
  },
  abilities: [
    {
      id: "1pp-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
    {
      id: "1pp-2",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
};
