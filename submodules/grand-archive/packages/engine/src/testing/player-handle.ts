import { isGrandArchiveCardInstanceRef } from "./card-ref.ts";
import type { GrandArchiveCommand } from "../commands/commands.ts";
import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import type { GrandArchivePlayerId } from "../game/identity.ts";
import type {
  GrandArchiveLegalCommand,
  ListGrandArchiveLegalCommandsOptions,
} from "../commands/legal-commands.ts";
import type {
  GrandArchiveCommandFailure,
  GrandArchiveCommandSuccess,
  GrandArchiveCommandTransition,
} from "../procedures/game-flow/runtime.ts";
import type { GrandArchiveViewerState } from "../projection/view.ts";
import type {
  GrandArchiveCardRefFilter,
  GrandArchiveCardInstanceRef,
  GrandArchiveTestCardRef,
} from "./card-ref.ts";
import type { GrandArchiveTestEngine } from "./test-engine.ts";

/** Player-scoped intent surface over the production Grand Archive runtime. */
export class GrandArchivePlayerHandle {
  public constructor(
    private readonly engine: GrandArchiveTestEngine,
    public readonly id: GrandArchivePlayerId,
  ) {}

  public view(): GrandArchiveViewerState {
    return this.engine.view(this.id);
  }

  public card(
    ref: GrandArchiveTestCardRef,
    filter: GrandArchiveCardRefFilter = {},
  ): GrandArchiveCardInstanceRef {
    return this.engine.card(this.id, ref, filter);
  }

  public cards(
    ref: GrandArchiveTestCardRef,
    filter: GrandArchiveCardRefFilter = {},
  ): readonly GrandArchiveCardInstanceRef[] {
    return this.engine.cards(this.id, ref, filter);
  }

  public zone(zone: GrandArchiveZone): readonly GrandArchiveCardInstanceRef[] {
    return this.engine.zone(this.id, zone);
  }

  public legalCommands(
    options: ListGrandArchiveLegalCommandsOptions = {},
  ): readonly GrandArchiveLegalCommand[] {
    return this.engine.legalCommands(this.id, options);
  }

  public executeLegal(
    predicate: (candidate: GrandArchiveLegalCommand) => boolean,
    description?: string,
  ): GrandArchiveCommandSuccess {
    return this.engine.executeLegal(this.id, predicate, description);
  }

  public tryExecute(command: GrandArchiveCommand): GrandArchiveCommandTransition {
    return this.engine.tryExecute(this.id, command);
  }

  public expectFailure(command: GrandArchiveCommand): GrandArchiveCommandFailure {
    return this.engine.expectFailure(this.id, command);
  }

  public execute(command: GrandArchiveCommand): GrandArchiveCommandSuccess {
    return this.engine.execute(this.id, command);
  }

  public pass(): GrandArchiveCommandSuccess {
    return this.execute({ move: "pass" });
  }

  public activate(
    ref: GrandArchiveTestCardRef,
    options: Omit<Extract<GrandArchiveCommand, { move: "activate-card" }>, "move" | "cardId"> = {},
  ): GrandArchiveCommandSuccess {
    const card = isGrandArchiveCardInstanceRef(ref)
      ? this.card(ref)
      : this.card(ref, { zone: "hand" });
    return this.execute({ move: "activate-card", cardId: card.objectId, ...options });
  }

  public materialize(
    ref: GrandArchiveTestCardRef,
    options: Omit<Extract<GrandArchiveCommand, { move: "materialize" }>, "move" | "cardId"> = {},
  ): GrandArchiveCommandSuccess {
    const card = this.card(ref, { zone: "material-deck" });
    return this.execute({ move: "materialize", cardId: card.objectId, ...options });
  }

  public activateAbility(
    ref: GrandArchiveTestCardRef,
    abilityId: string,
    options: Omit<
      Extract<GrandArchiveCommand, { move: "activate-ability" }>,
      "move" | "sourceId" | "abilityId"
    > = {},
  ): GrandArchiveCommandSuccess {
    const source = this.card(ref);
    return this.execute({
      move: "activate-ability",
      sourceId: source.objectId,
      abilityId,
      ...options,
    });
  }

  public declareAttack(
    attacker: GrandArchiveTestCardRef,
    target: GrandArchiveTestCardRef,
    options: Omit<
      Extract<GrandArchiveCommand, { move: "declare-attack" }>,
      "move" | "attackerId" | "targetIds"
    > = {},
  ): GrandArchiveCommandSuccess {
    const attackerRef = this.card(attacker, { zone: "field" });
    const targetRef = this.engine.cardAcrossPlayers(target, { zone: "field" });
    return this.execute({
      move: "declare-attack",
      attackerId: attackerRef.objectId,
      targetIds: [targetRef.objectId],
      ...options,
    });
  }

  public concede(): GrandArchiveCommandSuccess {
    return this.execute({ move: "concede" });
  }
}
