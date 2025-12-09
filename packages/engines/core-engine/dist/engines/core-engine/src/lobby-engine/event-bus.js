export class LightweightEventBus {
    handlers = [];
    emit(event) {
        for (const handler of this.handlers) {
            try {
                handler(event);
            }
            catch (error) {
                console.error("Event handler error:", error);
            }
        }
    }
    on(handler) {
        this.handlers.push(handler);
        return () => this.off(handler);
    }
    off(handler) {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }
}
//# sourceMappingURL=event-bus.js.map