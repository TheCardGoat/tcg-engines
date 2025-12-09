import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaCardDefinition } from "./lorcana-card-repository";
export declare class LorcanaCardInstance extends CoreCardInstance<LorcanaCardDefinition> {
    constructor(engine: LorcanaEngine, card: LorcanaCardDefinition, instanceId: string, ownerId: string);
    get inkwell(): boolean;
    /**
     * Get typed Lorcana engine reference
     * Uses base class WeakRef functionality
     */
    getLorcanaEngine(): LorcanaEngine | undefined;
    /**
     * Lorcana-specific functionality that requires engine access
     * Uses base class withEngine method for safe access
     */
    getLorcanaSpecificData(): any;
    /**
     * Example of Lorcana-specific card behavior using engine
     */
    canBePlayed(): boolean;
}
//# sourceMappingURL=lorcana-card-instance.d.ts.map