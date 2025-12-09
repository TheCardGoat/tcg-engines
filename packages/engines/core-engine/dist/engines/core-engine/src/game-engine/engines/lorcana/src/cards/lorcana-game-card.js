import { GameCard, } from "~/game-engine/core-engine/card/game-card";
/**
 * Lorcana-specific card implementation with rich game logic
 * Uses context injection for performance while providing type-safe access
 */
export class LorcanaCard extends GameCard {
    // Type-safe access to Lorcana-specific properties
    get cost() {
        return this.definition.cost;
    }
    get inkwell() {
        return this.definition.inkwell;
    }
    get lore() {
        return this.definition.lore || 0;
    }
    get type() {
        return this.definition.type;
    }
    get colors() {
        return this.definition.colors || [];
    }
    get characteristics() {
        return this.definition.characteristics || [];
    }
    get strength() {
        return this.definition.strength || 0;
    }
    get willpower() {
        return this.definition.willpower || 0;
    }
    // Lorcana-specific type checks
    isCharacter() {
        return this.type === "character";
    }
    isAction() {
        return this.type === "action";
    }
    isItem() {
        return this.type === "item";
    }
    isSong() {
        return this.isAction() && this.characteristics.includes("Song");
    }
    isLocation() {
        return this.type === "location";
    }
    // Context-dependent state checks
    isExerted(ctx) {
        return ctx.isExerted(this.instanceId);
    }
    isShifted(ctx) {
        return ctx.isShifted(this.instanceId);
    }
    getShiftedFrom(ctx) {
        const shiftedFromId = ctx.getShiftedFrom(this.instanceId);
        if (!shiftedFromId)
            return undefined;
        const cardData = ctx.getCardData(shiftedFromId);
        return cardData
            ? new LorcanaCard(cardData.instanceId, cardData.ownerId, cardData.definition)
            : undefined;
    }
    // Game-specific play validation
    canBePlayed(ctx) {
        const zone = this.getZone(ctx);
        if (zone !== "hand")
            return false;
        const availableInk = ctx.getAvailableInk(this.ownerId);
        const playCost = this.getPlayCost(ctx);
        if (this.isSong()) {
            return this.canBeSung(ctx) && availableInk >= playCost;
        }
        return availableInk >= playCost;
    }
    getPlayCost(ctx) {
        if (this.isSong()) {
            return this.getSongCost(ctx);
        }
        return this.cost;
    }
    // Song-specific logic
    canBeSung(ctx) {
        if (!this.isSong())
            return false;
        const singers = this.getPotentialSingers(ctx);
        return singers.length > 0;
    }
    getSongCost(ctx) {
        if (!this.isSong())
            return this.cost;
        const bestSinger = this.getBestSinger(ctx);
        if (!bestSinger)
            return this.cost;
        return Math.max(0, this.cost - bestSinger.cost);
    }
    getPotentialSingers(ctx) {
        if (!this.isSong())
            return [];
        return ctx
            .queryLorcanaCards({
            zone: "play",
            owner: this.ownerId,
            type: "character",
            exerted: false,
        })
            .filter((singer) => singer.cost >= this.cost);
    }
    getBestSinger(ctx) {
        const singers = this.getPotentialSingers(ctx);
        if (singers.length === 0)
            return undefined;
        return singers.reduce((best, current) => current.cost > best.cost ? current : best);
    }
    // Inkwell-specific logic
    canBePutIntoInkwell(ctx) {
        if (!this.inkwell)
            return false;
        if (this.getZone(ctx) !== "hand")
            return false;
        // Check if player has already used this action this turn
        return !ctx.hasUsedTurnAction(this.ownerId, "putCardIntoInkwell");
    }
    // Character-specific logic
    canQuest(ctx) {
        if (!this.isCharacter())
            return false;
        if (this.getZone(ctx) !== "play")
            return false;
        if (this.isExerted(ctx))
            return false;
        // Characters can't quest the turn they're played (unless shifted)
        // This would need additional game state tracking
        return true;
    }
    canChallenge(ctx, target) {
        if (!this.isCharacter())
            return false;
        if (this.getZone(ctx) !== "play")
            return false;
        if (this.isExerted(ctx))
            return false;
        if (!target.isCharacter())
            return false;
        if (target.getZone(ctx) !== "play")
            return false;
        if (target.ownerId === this.ownerId)
            return false;
        return true;
    }
    // Shift-specific logic
    canShift(ctx, target) {
        if (!this.hasShift())
            return false;
        if (this.getZone(ctx) !== "hand")
            return false;
        if (target.getZone(ctx) !== "play")
            return false;
        if (target.ownerId !== this.ownerId)
            return false;
        if (target.isExerted(ctx))
            return false;
        // Check if target has the same name (basic shift rule)
        return this.canShiftOnto(target);
    }
    hasShift() {
        // Check if card has shift ability
        return this.definition.abilities?.some((ability) => ability.name?.toLowerCase().includes("shift"));
    }
    canShiftOnto(target) {
        // Basic shift rule: same character name
        return this.getBaseName() === target.getBaseName();
    }
    getBaseName() {
        // Extract base character name (before title)
        return this.name.split(" - ")[0] || this.name;
    }
    getShiftCost() {
        // Extract shift cost from abilities
        const shiftAbility = this.definition.abilities?.find((ability) => ability.name?.toLowerCase().includes("shift"));
        return shiftAbility?.cost || this.cost;
    }
    // Location-specific logic
    canBeMovedTo(ctx) {
        if (!this.isLocation())
            return true; // Non-locations can always be moved
        // Location-specific movement rules would go here
        return true;
    }
    // Card interaction helpers
    sharesColorWith(other) {
        return this.colors.some((color) => other.colors.includes(color));
    }
    sharesCharacteristicWith(other, characteristic) {
        return (this.characteristics.includes(characteristic) &&
            other.characteristics.includes(characteristic));
    }
    // Override toString for better debugging
    toString() {
        return `${this.name} (${this.cost} cost, ${this.type}) [${this.instanceId}]`;
    }
}
//# sourceMappingURL=lorcana-game-card.js.map