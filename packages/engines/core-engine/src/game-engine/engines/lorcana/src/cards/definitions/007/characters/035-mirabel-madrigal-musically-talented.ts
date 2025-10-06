import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mirabelMadrigalMusicallyTalented: LorcanitoCharacterCardDefinition =
  {
    id: "gpn",
    name: "Mirabel Madrigal",
    title: "Musically Talented",
    characteristics: ["floodborn", "hero", "madrigal"],
    text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)\nHER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
    type: "character",
    abilities: [
      shiftAbility(4, "Mirabel Madrigal"),
      wheneverQuests({
        name: "HER OWN SPECIAL GIFT",
        text: "Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
        optional: true,
        effects: [
          {
            type: "move",
            to: "hand",
            target: {
              type: "card",
              value: 1,
              filters: [
                { filter: "type", value: "action" },
                { filter: "characteristics", value: ["song"] },
                { filter: "zone", value: "discard" },
                { filter: "owner", value: "self" },
                {
                  filter: "attribute",
                  value: "cost",
                  comparison: { operator: "lte", value: 3 },
                },
              ],
            },
          },
        ],
      }),
    ],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["amber", "amethyst"],
    cost: 6,
    strength: 2,
    willpower: 6,
    illustrator: "Eri Welli",
    number: 35,
    set: "007",
    rarity: "super_rare",
    lore: 2,
  };
