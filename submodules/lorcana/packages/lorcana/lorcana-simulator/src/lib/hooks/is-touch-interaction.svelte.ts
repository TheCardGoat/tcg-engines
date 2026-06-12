import { MediaQuery } from "svelte/reactivity";

const TOUCH_INTERACTION_QUERY = "(hover: none), (pointer: coarse)";

export class IsTouchInteraction extends MediaQuery {
  constructor() {
    super(TOUCH_INTERACTION_QUERY);
  }
}
