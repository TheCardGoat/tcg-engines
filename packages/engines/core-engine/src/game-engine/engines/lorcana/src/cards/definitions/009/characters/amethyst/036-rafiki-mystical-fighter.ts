import { rafikiMysticalFighter as ogRafikiMysticalFighter } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rafikiMysticalFighter: LorcanaCharacterCardDefinition = {
  ...ogRafikiMysticalFighter,
  id: "b7e",
  reprints: [ogRafikiMysticalFighter.id],
  number: 36,
  set: "009",
};
