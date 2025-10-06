import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { healWhatHasBeenHurt as ogHealWhatHasBeenHurt } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions/026-heal-what-has-been-hurt";

export const healWhatHasBeenHurt: LorcanaActionCardDefinition = {
  ...ogHealWhatHasBeenHurt,
  id: "z47",
  reprints: [ogHealWhatHasBeenHurt.id],
  number: 27,
  set: "009",
};
