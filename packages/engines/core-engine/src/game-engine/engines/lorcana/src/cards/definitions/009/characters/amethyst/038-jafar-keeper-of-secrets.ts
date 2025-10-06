import { jafarKeeperOfSecrets as ogJafarKeeperOfTheSecrets } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/044-jafar-keeper-of-secrets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarKeeperOfSecrets: LorcanaCharacterCardDefinition = {
  ...ogJafarKeeperOfTheSecrets,
  id: "f6f",
  reprints: [ogJafarKeeperOfTheSecrets.id],
  number: 38,
  set: "009",
};
