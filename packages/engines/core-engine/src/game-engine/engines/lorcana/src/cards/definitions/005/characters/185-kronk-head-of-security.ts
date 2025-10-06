import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kronkHeadOfSecurity: LorcanaCharacterCardDefinition = {
  id: "y86",
  missingTestCase: true,
  name: "Kronk",
  title: "Head of Security",
  characteristics: ["floodborn", "captain", "ally"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Kronk.)_ **ARE YOU ON THE LIST?** During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
  type: "character",
  abilities: [
    shiftAbility(5, "Kronk"),
    wheneverBanishesAnotherCharacterInChallenge({
      name: "ARE YOU ON THE LIST?",
      text: "During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
      optional: true,
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    }),
  ],
  colors: ["steel"],
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 185,
  set: "SSK",
  rarity: "super_rare",
};
