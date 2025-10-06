import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleMechanicExtraordinaire: LorcanitoCharacterCardDefinition = {
  id: "rdt",
  name: "Belle",
  title: "Mechanic Extraordinaire",
  characteristics: ["floodborn", "hero", "princess", "inventor"],
  text: "Shift 7\nSALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.\nREPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
  type: "character",
  abilities: [
    shiftAbility(7, "belle"),
    {
      type: "static",
      name: "SALVAGE",
      text: "For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.",
      ability: "effects",
      effects: [
        {
          type: "replacement",
          replacement: "shift",
          duration: "next",
          amount: {
            dynamic: true,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
          target: thisCharacter,
        },
      ],
    },
    wheneverQuests({
      name: "REPURPOSE",
      text: "Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
      effects: [
        {
          type: "move",
          to: "deck",
          bottom: true,
          amount: 3,
          target: {
            type: "card",
            value: 3,
            upTo: true,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
          forEach: [youGainLore(1)],
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["ruby", "sapphire"],
  cost: 9,
  strength: 7,
  willpower: 7,
  illustrator: "Koni",
  number: 126,
  set: "007",
  rarity: "super_rare",
  lore: 3,
};
