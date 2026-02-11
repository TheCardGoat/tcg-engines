import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckParanormalInvestigator: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1pp-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      id: "1pp-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Detective"],
  cost: 6,
  externalIds: {
    ravensburger: "de6a595285baab6c696be402cabc1e2f72843de3",
  },
  fullName: "Daisy Duck - Paranormal Investigator",
  id: "1pp",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Daisy Duck",
  set: "010",
  strength: 4,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Daisy Duck.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.",
  version: "Paranormal Investigator",
  willpower: 6,
};
