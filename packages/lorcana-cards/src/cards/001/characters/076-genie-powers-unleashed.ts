import type { CharacterCard } from "@tcg/lorcana-types";

export const GeniePowersUnleashed: CharacterCard = {
  id: "dgz",
  cardType: "character",
  name: "Genie",
  version: "Powers Unleashed",
  fullName: "Genie - Powers Unleashed",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
  cost: 8,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 76,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
      id: "dgz-1",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn"],
};
