import { mamaOdieMysticalMaven as mamaOdieMysticalMavenAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mamaOdieMysticalMaven: LorcanaCharacterCardDefinition = {
  ...mamaOdieMysticalMavenAsOrig,
  id: "j6p",
  reprints: [mamaOdieMysticalMavenAsOrig.id],
  number: 152,
  set: "009",
};
