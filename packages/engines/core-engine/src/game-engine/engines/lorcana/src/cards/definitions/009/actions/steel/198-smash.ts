import { smash as ogSmash } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/200-smash";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const smash: LorcanaActionCardDefinition = {
  ...ogSmash,
  id: "zfz",
  reprints: [ogSmash.id],
  number: 198,
  set: "009",
};
