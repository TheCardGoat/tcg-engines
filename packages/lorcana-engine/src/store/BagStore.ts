import type {
  ActivatedAbility,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { AbilityModel } from "@lorcanito/lorcana-engine/store/models/AbilityModel";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { StackLayerModel } from "@lorcanito/lorcana-engine/store/models/StackLayerModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies } from "@lorcanito/lorcana-engine/store/types";
import type { GameEffect } from "@lorcanito/lorcana-engine/types/types";
import { makeAutoObservable, toJS } from "mobx";

// 1.7. The Bag
// 1.7.1. The bag is the zone where triggered abilities wait to resolve. It’s not a physical zone but a way to picture the process of resolving triggered abilities. Think of each triggered ability as a marble and the bag as a place to put them until they’re resolved. Every marble is separate from every other marble, and a player can look through the bag of marbles to select the one they wish to resolve next.
// 1.7.2. It’s possible for both the active player and their opponent(s) to add triggered abilities to the bag at the same time. Resolving these abilities follows the rules in section 8.7, Bag.

// 7.4. Triggered Abilities
// 7.4.1. Triggered abilities occur when their trigger condition is met. They trigger only once per trigger condition that is met.
// 7.4.2. Triggered abilities start with "When," "Whenever," "At the start of," or "At the end of" and describe the game state that causes the abilities to trigger and the effects of the abilities.
// 7.4.3. When an ability triggers, its effect is placed into the bag to be resolved in order as described in section 8.7, "Bag."
// 7.4.4. Some triggered abilities are written as "[Trigger Condition], if [Secondary Condition], [Effect]. These abilities check whether the secondary condition is true both when the effect would be added to the bag and again when the effect resolves.
// 7.4.4.1. If the secondary condition is false when the effect would be added to the bag, the effect is never added to the bag.
// 7.4.4.2. If the secondary condition is false when the effect would resolve, the triggered ability resolves with no effect.
// 7.4.5. Some triggered abilities are written as, "[Trigger Condition], [Effect]. [Effect]." Both effects are linked to the trigger condition but are independent of each other.
// 7.4.6. Some triggered abilities are written as, "[Trigger Condition] and [Trigger Condition], [Effect]." These abilities function as having two triggered abilities that are independent of each other but both resolve for the same effect.
// 7.4.7. Some abilities and effects create a trigger condition that lasts a duration of time where they exist and can occur. These are usually created as the result of a resolving action. They are functional only for the stated duration. Once that duration has passed, the trigger condition ceases to exist. These are known as floating triggered abilities.

// 8.7. Bag
// 8.7.1. Unlike other zones, the bag isn't a physical space but is only where triggered abilities created by the game wait to resolve.
// 8.7.2. Only triggered abilities can be added to the bag. Activated abilities, resolving actions, and playing characters, locations, or items aren't added to the bag.
// 8.7.3. Whenever a triggered ability's condition is met, the ability is added to the bag by the player who played the card with the triggered ability. If multiple triggered abilities happen at the same time, they're added to the bag simultaneously by the respective players.
// 8.7.4. Then the active player chooses and resolves any one of their triggered abilities and fully resolves it. If the resolution of an ability causes another ability to trigger, the new triggered ability is added to the bag once the current ability is finished resolving.
// 8.7.5. If there are abilities from multiple players in the bag, the active player resolves all of their abilities first, one at a time, including any that were added as a result of resolving abilities.
// 8.7.6. The next player resolves all of their abilities following the guidelines in 8.7.5. If this causes new triggers, regardless of whose abilities triggered, the current resolving player keeps resolving their triggers.
// 8.7.7. Continue around the table in turn order as described in 8.7.5–8.7.6 until there are no more triggers to resolve.
// 8.7.8. Once the bag is empty and all players have no more abilities to resolve or turn actions to take, the players proceed to the next step or phase of the game.
// 8.7.9. If a player leaves the game while abilities are still waiting in the bag to resolve, those abilities cease to exist.

export class BagStore {
  dependencies: Dependencies;
  layers: StackLayerModel[];
  readonly rootStore: MobXRootStore;
  readonly observable: boolean;

  constructor(
    initialState: GameEffect[] = [],
    dependencies: Dependencies,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    if (observable) {
      makeAutoObservable(this, { rootStore: false, dependencies: false });
    }
    this.observable = observable;
    this.dependencies = dependencies;
    this.rootStore = rootStore;

    this.layers = [];
    this.sync(initialState);
  }

  sync(effects: GameEffect[] = []) {
    if (!effects) {
      this.layers = [];
      return;
    }

    this.layers = effects.map((effect) => {
      const ability = effect.ability as ResolutionAbility | ActivatedAbility;
      const source = this.rootStore.cardStore.getCard(effect.instanceId);
      const abilityModel = new AbilityModel(
        ability,
        source as CardModel, // TODO: CardNotFound issue
        this.rootStore,
        this.observable,
      );

      return new StackLayerModel(
        effect.id,
        source as CardModel, // TODO: CardNotFound issue
        abilityModel,
        this.rootStore,
        this.observable,
      );
    });
  }

  // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
  // https://mobx.js.org/computeds.html
  toJSON(): GameEffect[] | undefined {
    if (this.layers.length === 0) {
      return undefined;
    }

    return toJS(this.layers.map((effect) => effect.toJSON()));
  }
}
