import { AbilityModel } from "@lorcanito/lorcana-engine/store/models/AbilityModel";
import { StackLayerModel } from "@lorcanito/lorcana-engine/store/models/StackLayerModel";
import { autoTarget } from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import { logger } from "@lorcanito/shared/libs/logger";
import { makeAutoObservable, toJS } from "mobx";
export class StackLayerStore {
    dependencies;
    layers;
    rootStore;
    observable;
    constructor(
    // biome-ignore lint/style/useDefaultParameterLast: <explanation>
    initialState = [], dependencies, rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, { rootStore: false, dependencies: false });
        }
        this.observable = observable;
        this.dependencies = dependencies;
        this.rootStore = rootStore;
        this.layers = [];
        this.sync(initialState);
    }
    sync(effects = []) {
        if (!effects) {
            this.layers = [];
            return;
        }
        this.layers = effects.map((effect) => {
            const ability = effect.ability;
            const source = this.rootStore.cardStore.getCard(effect.instanceId);
            const abilityModel = new AbilityModel(ability, source, // TODO: CardNotFound issue
            this.rootStore, this.observable);
            return new StackLayerModel(effect.id, source, // TODO: CardNotFound issue
            abilityModel, this.rootStore, this.observable);
        });
    }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        if (this.layers.length === 0) {
            return undefined;
        }
        return toJS(this.layers.map((effect) => effect.toJSON()));
    }
    getLayer(effectId) {
        return this.layers.find((effect) => effect.id === effectId);
    }
    addAbilityToStack(ability, card, opts = {}) {
        // Activated abilities should verify condition BEFORE activating.
        if (!(ability.isActivatedAbility || ability.areConditionsMet)) {
            this.rootStore.debug(`Resolution ability condition not met: ${ability.name}`);
            this.rootStore.debugCondition(ability.conditions, card);
            return this.rootStore.sendNotification({
                type: "icon",
                icon: "warning",
                title: "Ability's condition are not met",
                message: `Card effect's is being skipped`,
                autoClear: true,
            });
        }
        if (ability.optional && !ability.ability.optional) {
            if (this.rootStore.configurationStore.autoAcceptOptionals) {
                this.rootStore.log({
                    type: "AUTO_OPTIONAL_ENGAGED",
                    ability: ability.name,
                });
            }
        }
        const source = ability.source;
        if (ability.ability.oncePerTurn && !ability.ability.accepted) {
            const table = this.rootStore.tableStore.getTable(source.ownerId);
            const hasAlreadyUsedAbility = table.hasUsedAbility(ability.name, source.instanceId);
            if (hasAlreadyUsedAbility) {
                this.rootStore.trace(`Ability already used this turn ${ability.name} by ${source.instanceId}`);
                return this.rootStore.moveResponse(true);
            }
            table.addUsedAbility(ability.name, source.instanceId);
        }
        if (ability.optional && !ability.ability.accepted) {
            this.rootStore.debug("Optional ability, adding to stack: ", ability.name, card.fullName);
            this.addOptionalLayerToStack(ability, card, {
                addToTheBottomOfStack: opts.addToTheBottomOfStack,
            });
            return this.rootStore.moveResponse(true);
        }
        if (ability.resolveAmountBeforeCreatingLayer) {
            ability.resolveAmount(opts.params);
        }
        // resolveEffectsIndividually will create a separate layer for each effect an ability has
        if (ability.resolveEffectsIndividually) {
            const effects = ability.effects;
            for (let i = 0; i < effects.length; i++) {
                const effect = effects[i];
                if (effect) {
                    if (!this.rootStore.effectStore.metCondition(ability.source, effect.effect.conditions)) {
                        this.rootStore.trace(`Skipping effect, condition not met: ${JSON.stringify(effect)}`);
                        continue;
                    }
                    this.rootStore.debug(`Adding effects on stack individually: ${JSON.stringify(effect)}`);
                    const rawAbility = {
                        ...ability.ability,
                        // Ability has been accepted
                        optional: false,
                        effects: [effect.effect],
                    };
                    const model = new AbilityModel(rawAbility, card, this.rootStore, this.observable);
                    this.addLayerToStack(card, model, {
                        skipLogs: i !== effects.length - 1,
                        skipResolution: i !== effects.length - 1,
                        addToTheBottomOfStack: opts.addToTheBottomOfStack,
                        skipAutoResolve: opts.skipAutoResolve,
                    });
                }
            }
        }
        else {
            this.addLayerToStack(card, ability, opts);
        }
        return this.rootStore.moveResponse(true);
    }
    addLayerToStack(card, ability, params = {}) {
        const id = `${ability.responder}___${this.layers.length}___${card.instanceId}___${ability.name}___${ability.effects
            .map((effect) => effect.effect.type)
            .join("_")}`;
        const layer = new StackLayerModel(id, card, ability, this.rootStore, this.observable);
        // We could also let the layer go to stack and cancel the effect
        if (layer.isInvalidTargetResolution(params.skipResolution)) {
            if (layer.ability.hasDependentEffects) {
                this.rootStore.trace(`Invalid target for an dependent effect, Skipping resolution: ${layer.id}-${ability.name}-${ability.effects[0]?.effect.type}`);
                const topLayer = this.topLayer;
                if (topLayer?.ability?.hasDependentEffects &&
                    topLayer.ability.ability.name === ability.ability.name) {
                    topLayer.skipEffect();
                }
                else {
                    this.rootStore.trace(`Stack is empty or top layer is not the same as the current layer: ${JSON.stringify(topLayer || {})}`);
                }
            }
            console.log("=====>>>>");
            return this.rootStore.log({
                type: "INVALID_TARGET_RESOLUTION",
                effect: layer.toJSON(),
            });
        }
        // This is a design decision, whether we want to add the layer to the stack, when there's no valid target
        if (params.addToTheBottomOfStack) {
            this.layers.unshift(layer);
        }
        else {
            this.layers.push(layer);
        }
        if (!(params.skipLogs && ability.ability.resolveEffectsIndividually)) {
            this.rootStore.log({ type: "EFFECT", effect: layer.toJSON() });
        }
        if (params.skipResolution && layer.autoResolve) {
            this.rootStore.trace(`Skipping resolution: ${ability.name}-${ability.effects[0]?.effect.type}`);
        }
        else if (layer.autoResolve && !params.skipAutoResolve) {
            this.rootStore.trace(`Auto resolving: ${ability.name}-${ability.effects[0]?.effect.type}`);
            const resolvingParams = params.params || {};
            this.resolveLayerById(layer.id, resolvingParams, params);
        }
        else if (!params.skipAutoResolve) {
            this.rootStore.trace(`Not auto resolving, player has to choose a target for: ${ability.name}-${ability.effects[0]?.effect.type}.`);
        }
        if (this.rootStore.configurationStore.autoTarget) {
            this.autoTarget(layer);
        }
        this.rootStore.resetPriority();
    }
    addOptionalLayerToStack(ability, card, opts = {}) {
        const id = `${ability.responder}___${this.layers.length}___${card.instanceId}___${ability.name}___${ability.effects
            .map((effect) => effect.effect.type)
            .join("_")}`;
        const layer = new StackLayerModel(id, card, 
        // Cloning object to avoid changing the original object, which causes all references on stack to get updated
        new AbilityModel(JSON.parse(JSON.stringify(ability.ability)), ability.source, this.rootStore, this.observable), this.rootStore, this.observable);
        if (opts.addToTheBottomOfStack) {
            this.layers.unshift(layer);
        }
        else {
            this.layers.push(layer);
        }
        this.rootStore.resetPriority();
        this.rootStore.log({
            type: "OPTIONAL_ABILITY_ON_STACK_ADDED",
            ability: ability.toJSON(),
            source: ability.source.instanceId,
        });
    }
    autoTarget(layer) {
        return autoTarget(this, this.rootStore, layer);
    }
    removeLayerFromStack(layer) {
        const index = this.layers.findIndex((element) => element.id === layer.id);
        if (index !== -1) {
            return this.layers.splice(index, 1);
        }
        console.error("Effect not found", layer.id);
        return [];
    }
    /**
     * @deprecated Use sortedTopLayer instead.
     */
    get topLayer() {
        return this.layers[this.layers.length - 1];
    }
    // In the past, layers were designed to act as a stack. But it turns out that Lorcana doesn't use a stack.
    get sortedTopLayer() {
        return this.rootStore.turnPlayer === this.rootStore.activePlayer
            ? this.ownLayers[0] || this.opponentLayers[0]
            : this.opponentLayers[0] || this.ownLayers[0];
    }
    get ownLayers() {
        return this.layers.filter((layer) => layer.responder === this.rootStore.activePlayer);
    }
    get opponentLayers() {
        return this.layers.filter((layer) => layer.responder !== this.rootStore.activePlayer);
    }
    get getLayers() {
        return [...this.layers].sort((a, b) => {
            const turnPlayer = this.rootStore.turnPlayer;
            const score = (layer) => {
                let s = 0;
                if (layer.responder === turnPlayer) {
                    s += 1;
                }
                if (layer.source.type === "action") {
                    s += 2;
                }
                return s;
            };
            return score(a) - score(b);
        });
    }
    resolveTopOfStack(params = {}) {
        // TODO: Only the layer owner should be able to resolve it
        const layer = this.topLayer;
        if (layer) {
            return this.resolveLayerById(layer.id, params);
        }
        console.error("Layer not found");
        return false;
    }
    resolveLayerById(layerId, params = {}, opts = {}) {
        console.group();
        // TODO: Only the layer owner should be able to resolve it
        const layerBeingResolved = this.getLayer(layerId);
        if (!layerBeingResolved) {
            this.rootStore.sendNotification({
                type: "icon",
                icon: "warning",
                title: "Layer not found",
                message: "Layer not found",
                autoClear: true,
            });
            return this.rootStore.moveResponse(false);
        }
        // if (
        //   layerBeingResolved.source.type !== "action" &&
        //   this.layers.find((layer) => layer.source.type === "action")
        // ) {
        //   this.rootStore.sendNotification({
        //     type: "icon",
        //     icon: "warning",
        //     title: "You should first resolve action cards",
        //     message: `You cannot resolve a layer while an action card is on the bag`,
        //     autoClear: true,
        //   });
        //   return this.rootStore.moveResponse(false);
        // }
        if (layerBeingResolved.ability.ability.nameACard && !params.nameACard) {
            this.rootStore.sendNotification({
                type: "icon",
                icon: "warning",
                title: "Name a card",
                message: "You have to name a card to resolve this effect",
                autoClear: true,
            });
            return this.rootStore.moveResponse(false);
        }
        if (layerBeingResolved.requiresPlayerTarget() && !params.targetPlayer) {
            if (process.env.NODE_ENV !== "production") {
                console.error("Player target required", JSON.stringify(layerBeingResolved));
            }
            this.rootStore.sendNotification({
                type: "icon",
                icon: "warning",
                title: "Player target required",
                message: "You have to target a player to resolve this effect",
                autoClear: true,
            });
            return this.rootStore.moveResponse(false);
        }
        if (!layerBeingResolved.isOptional()) {
            if (
            // !layerBeingResolved.hasValidTarget()
            layerBeingResolved.isInvalidTargetResolution()) {
                return this.rootStore.log({
                    type: "INVALID_TARGET_RESOLUTION",
                    effect: layerBeingResolved.toJSON(),
                });
            }
        }
        const map = params.targets?.map((target) => target.fullName);
        this.rootStore.debug(`Resolving layer: ${layerBeingResolved.name}, targets: ${map} ${params.scry ? JSON.stringify(params.scry) : ""}`);
        const resolved = layerBeingResolved.resolve(params, opts);
        if (resolved) {
            this.rootStore.debug(`Resolved ${layerBeingResolved.ability.name}, targets: ${params.targets?.map((target) => target.fullName)}`);
            this.removeLayerFromStack(layerBeingResolved);
            const newTopLayer = this.topLayer;
            if (layerBeingResolved.ability.resolveEffectsIndividually &&
                newTopLayer?.ability.resolveEffectsIndividually &&
                // TODO: This is a temporary fix, we should be able to resolve optional abilities
                // it's causing dead loop
                !newTopLayer.isOptional()) {
                this.rootStore.debug(`Resolving next effect: ${newTopLayer.ability.name}-${newTopLayer.ability.effects[0]?.effect.type}`);
                // We should only resolve the next effect if it's autoResolve
                // autoResolve doesn't need params
                // TODO: change the engine so it always resolves the top layer
                try {
                    if (newTopLayer.getPotentialTargets().length === 0 &&
                        newTopLayer.ability.hasDependentEffects) {
                        logger.trace("No valid targets for dependent effect", newTopLayer.ability.name);
                        newTopLayer.skipEffect();
                    }
                    else if (newTopLayer.autoResolve) {
                        this.resolveLayerById(newTopLayer.id, {}, opts);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        else {
            this.rootStore.debug(`Not Resolved ${layerBeingResolved.ability.name}`);
        }
        this.rootStore.resetPriority();
        if (this.rootStore.isPassingTurn && this.layers.length === 0) {
            this.rootStore.passTurn();
        }
        console.groupEnd();
        return this.rootStore.moveResponse(true);
    }
}
//# sourceMappingURL=StackLayerStore.js.map