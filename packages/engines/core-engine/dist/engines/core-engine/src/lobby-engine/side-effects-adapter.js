import { logger } from "../shared/logger";
// Base class for side effects adapters to implement common functionality
export class BaseSideEffectsAdapter {
    logger = logger;
    onLobbyEvent = (_event) => { };
    dispose() {
        // Base implementation for cleanup
        // Individual adapters should override this method
        this.logger.debug("[BaseSideEffectsAdapter] dispose() called");
    }
}
//# sourceMappingURL=side-effects-adapter.js.map