import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanImperialGeneral: LorcanaCharacterCardDefinition = {
  id: "m95",
  name: "Mulan",
  title: "Imperial General",
  characteristics: ["floodborn", "hero", "princess"],
  text: `Shift 5\nEvasive\nEXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.`,
  type: "character",
  abilities: [
    shiftAbility(5, "Mulan"),
    evasiveAbility,
    wheneverChallengesAnotherChar({
      name: "EXCEPTIONAL LEADER",
      text: `Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.`,
      effects: [
        {
          type: "ability",
          ability: "challenge_ready_chars",
          modifier: "add",
          duration: "turn",
          until: true,
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["ruby", "steel"],
  cost: 7,
  strength: 5,
  willpower: 6,
  illustrator: "Jochem van Gool",
  number: 141,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
