import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { vanishAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/vanishAbility";
import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const abuIllusoryPachyderm: LorcanaCharacterCardDefinition = {
  id: "l54",
  name: "Abu",
  title: "Illusory Pachyderm",
  characteristics: ["dreamborn", "ally", "illusion"],
  text: "Vanish\nGRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
  type: "character",
  abilities: [
    vanishAbility,
    wheneverQuests({
      name: "GRASPING TRUNK",
      text: "Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
      effects: [
        {
          type: "create-layer-based-on-target",
          target: chosenOpposingCharacter,
          // TODO: this is working kind of by accident
          // the dynamic amount from the parent effect forces this amount to be replaced.
          resolveAmountBeforeCreatingLayer: true,
          effects: [
            youGainLore({
              dynamic: true,
              target: { attribute: "lore" },
            }),
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst", "steel"],
  cost: 6,
  strength: 3,
  willpower: 7,
  illustrator: "Grace Tran",
  number: 50,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
