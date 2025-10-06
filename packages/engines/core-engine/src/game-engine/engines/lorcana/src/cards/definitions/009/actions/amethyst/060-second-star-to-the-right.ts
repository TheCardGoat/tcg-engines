import { secondStarToTheRight as ogSecondStarToTheRight } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/061-second-star-to-the-right";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const secondStarToTheRight: LorcanaActionCardDefinition = {
  ...ogSecondStarToTheRight,
  id: "dac",
  reprints: [ogSecondStarToTheRight.id],
  number: 60,
  set: "009",
};
