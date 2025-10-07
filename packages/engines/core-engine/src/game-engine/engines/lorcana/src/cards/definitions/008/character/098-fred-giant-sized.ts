import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { CardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const floodBornCharInYourDeck: CardTarget = {
  type: "card",
  cardType: "character",
  withClassification: "floodborn",
  zone: "deck",
};

const revealTopCardEffect = {
  type: "reveal-from-top-until",
  target: floodBornCharInYourDeck,
  onTargetMatchEffects: [
    {
      type: "create-layer-based-on-target",
      filters: floodBornCharInYourDeck.filters,
      // TODO: get rid of target
      target: floodBornCharInYourDeck,
      effects: [
        {
          type: "move",
          to: "hand",
          target: floodBornCharInYourDeck,
        },
      ],
    },
  ],
};

export const fredGiantsized: LorcanaCharacterCardDefinition = {
  id: "fgp",
  name: "Fred",
  title: "Giant-Sized",
  characteristics: ["floodborn", "hero"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Fred.)\nI LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
  type: "character",
  abilities: [
    shiftAbility(5, "Fred"),
    wheneverQuests({
      name: "I LIKE WHERE THIS IS HEADING",
      text: "Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
      effects: [
        revealTopCardEffect,
        {
          type: "shuffle-deck",
          target: self,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 7,
  strength: 5,
  willpower: 6,
  illustrator: "Jules Dubost",
  number: 98,
  set: "008",
  rarity: "rare",
  lore: 3,
};
