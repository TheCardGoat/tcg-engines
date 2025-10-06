import { healWhatHasBeenHurt as ogHealWhatHasBeenHurt } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions/026-heal-what-has-been-hurt";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const healWhatHasBeenHurt: LorcanaActionCardDefinition = {
  ...ogHealWhatHasBeenHurt,
  id: "z47",
  reprints: [ogHealWhatHasBeenHurt.id],
  number: 27,
  set: "009",
};
