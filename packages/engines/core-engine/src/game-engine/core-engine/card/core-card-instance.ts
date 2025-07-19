import type { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";

export class CoreCardInstance<T extends { id: string }> {
  readonly instanceId: string;
  readonly ownerId: string;
  readonly card: T;
  readonly contextProvider: CoreCardCtxProvider;

  constructor({
    instanceId,
    ownerId,
    definition,
    contextProvider,
  }: {
    instanceId: string;
    ownerId: string;
    definition: T;
    contextProvider: CoreCardCtxProvider;
  }) {
    this.instanceId = instanceId;
    this.ownerId = ownerId;
    this.card = definition;
    this.contextProvider = contextProvider;
  }

  get publicId() {
    return this.card.id;
  }

  get id() {
    return this.card.id;
  }

  get owner(): string | undefined {
    return this.ownerId;
  }

  get zone(): string | undefined {
    const ctx = this.contextProvider.getCtx();

    // Find the zone that contains this card instance
    for (const zoneId in ctx.cardZones) {
      const zone = ctx.cardZones[zoneId];
      if (zone.cards.includes(this.instanceId)) {
        return zone.name;
      }
    }

    return undefined;
  }

  isEqual(other: CoreCardInstance<T>): boolean {
    return this.instanceId === other.instanceId;
  }

  // toJSON() {
  //   return {
  //     instanceId: this.instanceId,
  //     ownerId: this.ownerId,
  //     publicId: this.publicId,
  //     definition: this.definition,
  //     owner: this.owner,
  //     zone: this.zone,
  //   };
  // }
}
