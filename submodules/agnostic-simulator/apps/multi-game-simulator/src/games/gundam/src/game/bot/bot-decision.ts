import {
  createStaticResources,
  MatchRuntime,
  rankGundamBotCandidates,
  getSafeGundamAutomatedActionStrategyOption,
  type MatchStaticResources,
} from "@tcg/gundam-engine";
export interface GundamBotContext {
  players: MatchStaticResources["players"];
  catalog: ReturnType<MatchStaticResources["catalog"]["entries"]> extends IterableIterator<
    infer Entry
  >
    ? Entry[]
    : never;
  setupCards: MatchStaticResources["setupCards"];
}
export interface GundamBotInput {
  state: ReturnType<MatchRuntime["getState"]>;
  instances: ReturnType<
    MatchStaticResources["cardsMaps"]["instances"]["entries"]
  > extends IterableIterator<infer Entry>
    ? Entry[]
    : never;
  definitions: [string, NonNullable<ReturnType<MatchStaticResources["getDefinition"]>>][];
  player: Parameters<typeof rankGundamBotCandidates>[1];
  strategyId: string;
}
export function createGundamBotPlanner(context: GundamBotContext) {
  const resources = createStaticResources(
    context.players,
    new Map(context.catalog),
    context.setupCards,
  );
  return (input: GundamBotInput) => {
    for (const [id, definition] of input.definitions)
      resources.cardsMaps.definitions.set(id, definition);
    for (const entry of resources.cardsMaps.instances.entries())
      resources.cardsMaps.instances.delete(entry.instanceId);
    for (const { instanceId, definitionId, ownerID } of input.instances)
      resources.cardsMaps.instances.register(instanceId, { definitionId, ownerID });
    const runtime = new MatchRuntime(resources);
    runtime.loadState(input.state, { silent: true });
    return rankGundamBotCandidates(
      runtime,
      input.player,
      getSafeGundamAutomatedActionStrategyOption(input.strategyId).strategy,
      resources,
    );
  };
}
