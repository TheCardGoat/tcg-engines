import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { GundamEngine } from "~/game-engine/engines/gundam/src/gundam-engine";
import type { GundamitoCard } from "./definitions/cardTypes";
export declare class GundamModel extends CoreCardInstance<GundamitoCard> {
    constructor({ engine, card, instanceId, ownerId, }: {
        engine: GundamEngine;
        card: GundamitoCard;
        instanceId: string;
        ownerId: string;
    });
    /**
     * Get typed Gundam engine reference
     * Uses base class WeakRef functionality
     */
    getGundamEngine(): GundamEngine | undefined;
    /**
     * Gundam-specific functionality that requires engine access
     * Uses base class withEngine method for safe access
     */
    getGundamSpecificData(): any;
    /**
     * Example of Gundam-specific card behavior using engine
     */
    canBePlayed(): boolean;
    /**
     * Gundam-specific attachment logic
     */
    canAttachTo(targetCardId: string): boolean;
}
//# sourceMappingURL=gundam-card-model.d.ts.map