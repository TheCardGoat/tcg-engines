import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
} from "../lorcana-engine-types";
import type {
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";
import type { LorcanaCardDefinition } from "./lorcana-card-repository";

export class LorcanaCardInstance extends CoreCardInstance<LorcanaCardDefinition> {
  constructor(
    engine: LorcanaEngine,
    card: LorcanaCardDefinition,
    instanceId: string,
    ownerId: string,
  ) {
    const contextProvider = new CoreCardCtxProvider<
      LorcanaGameState,
      LorcanaCardDefinition,
      LorcanaPlayerState,
      LorcanaCardFilter,
      LorcanaCardInstance
    >({
      engine: engine,
    });

    super({
      instanceId,
      ownerId,
      definition: card,
      contextProvider,
    });
  }

  get inkwell(): boolean {
    return this.card.inkwell;
  }

  canBePlayed(): boolean {
    return true;
  }

  get meta(): LorcanaCardMeta {
    const G = this.contextProvider.getG() as LorcanaGameState;
    return G.metas?.[this.instanceId] || {};
  }

  get type(): LorcanaCardDefinition["type"] {
    return this.card.type;
  }

  get isExerted(): boolean {
    return !!this.meta.exerted;
  }

  isAtLocation(location: LorcanaCardInstance): boolean {
    return this.meta.location === location.instanceId;
  }

  get name() {
    return this.card.name;
  }

  get fullName() {
    if (this.card.title) {
      return `${this.card.name} - ${this.card.title}`;
    }

    return this.name;
  }

  get location(): LorcanaCardInstance | undefined {
    const locationId = this.meta.location;

    if (!locationId) {
      return undefined;
    }

    const cardInstance = this.contextProvider.getCardInstance(locationId);

    // The engine ensures all instances are properly typed after initialization
    // This check validates that we have the expected LorcanaCardInstance
    if (cardInstance instanceof LorcanaCardInstance) {
      return cardInstance;
    }

    return undefined;
  }

  containsCharacter(character: LorcanaCardInstance): boolean {
    return (
      Array.isArray(this.meta.characters) &&
      this.meta.characters.includes(character.instanceId)
    );
  }
}
