import { doloresMadrigalEasyListener as ogDoloresMadrigalEasyListener } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/041-dolores-madrigal-easy-listener";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const doloresMadrigalEasyListener: LorcanaCharacterCardDefinition = {
  ...ogDoloresMadrigalEasyListener,
  id: "yvi",
  reprints: [ogDoloresMadrigalEasyListener.id],
  number: 51,
  set: "009",
};
