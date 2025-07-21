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
  TriggerTiming,
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

  get moveCost(): number {
    return this.card.moveCost || 0;
  }

  get inkwell(): boolean {
    return this.card.inkwell;
  }

  get owner(): string {
    return this.ownerId;
  }

  hasTriggerFor(timing: TriggerTiming) {
    if (timing === "endOfTurn" && this.card.abilities) {
      return this.card.abilities?.some((ability) =>
        hasEndOfTurnTrigger(ability, timing),
      );
    }

    return false;
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

  isEqual(other: LorcanaCardInstance): boolean {
    return this.instanceId === other.instanceId;
  }

  containsCharacter(character: LorcanaCardInstance): boolean {
    return (
      Array.isArray(this.meta.characters) &&
      this.meta.characters.includes(character.instanceId)
    );
  }
}

/**
 * Check if an ability has an end-of-turn trigger
 * This handles various formats that end-of-turn abilities might be defined in
 */
function hasEndOfTurnTrigger(ability: any, timing: string): boolean {
  if (!ability) return false;

  // Check various common formats for end-of-turn triggers
  return (
    // Format 1: Simple trigger property
    ability.trigger === timing ||
    (ability.trigger === "endOfTurn" && timing === "endOfTurn") ||
    (ability.trigger === "startOfTurn" && timing === "startOfTurn") ||
    // Format 2: Nested trigger object
    (ability.trigger?.on === "end-of-turn" && timing === "endOfTurn") ||
    (ability.trigger?.on === "start-of-turn" && timing === "startOfTurn") ||
    // Format 3: Text-based detection (common in card games)
    (typeof ability.text === "string" &&
      timing === "endOfTurn" &&
      (ability.text.toLowerCase().includes("at the end of") ||
        ability.text.toLowerCase().includes("end of turn"))) ||
    (typeof ability.text === "string" &&
      timing === "startOfTurn" &&
      (ability.text.toLowerCase().includes("at the start of") ||
        ability.text.toLowerCase().includes("beginning of turn"))) ||
    // Format 4: Lorcana-specific triggered ability format
    (ability.type === "triggered" && ability.trigger === timing) ||
    // Format 5: timing property
    ability.timing === timing
  );
}
