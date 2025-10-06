import { opponentRevealHand } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaEricsBride: LorcanaCharacterCardDefinition = {
  id: "hvg",
  missingTestCase: true,
  name: "Ursula",
  title: "Eric's Bride",
  characteristics: ["floodborn", "sorcerer", "villain", "princess"],
  text: "**Shift: Discard a song card** _(You may discard a song card to play this on top of one of your characters named Ursula.)_\n\n**VANESSA'S DESIGN** Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
  type: "character",
  abilities: [
    shiftAbility(
      [
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
            { filter: "type", value: "action" },
            { filter: "characteristics", value: ["song"] },
          ],
        },
      ],
      "ursula",
      "**Shift: Discard a song card**",
    ),
    wheneverQuests({
      name: "VANESSA'S DESIGN",
      text: "Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["location", "item", "action"] },
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
        opponentRevealHand,
      ],
    }),
  ],
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Lisanne Koeteeuw",
  number: 24,
  set: "URR",
  rarity: "rare",
};
