import { z } from "zod";
import {
  fleshAndBloodPublicCardIdentities,
  getFleshAndBloodCard,
} from "@tcg/flesh-and-blood-cards/catalog";
import { loadFleshAndBloodStructuredCards } from "@tcg/flesh-and-blood-cards/runtime-registry";
import {
  createFabMatchContext,
  FabMatchRuntime,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  toFabCardDefinition,
  type FabPracticeMatch,
  type FabRegisteredCardDefinition,
} from "@tcg/flesh-and-blood-engine/simulator";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

const ForkStateSchema = z.object({
  snapshot: z.unknown().refine(isFabMatchSnapshotV21, "The saved engine version is not supported."),
  cardDefinitionIds: z.array(z.string().min(1)).min(1),
});

/** Recompile the exact definition keys; engine fingerprint validation rejects rules drift. */
export async function restoreFabReplayFork(value: unknown): Promise<FabPracticeMatch> {
  const data = ForkStateSchema.parse(value);
  if (!isFabMatchSnapshotV21(data.snapshot))
    throw new Error("Invalid Flesh and Blood continuation state.");
  const cards = await loadFleshAndBloodStructuredCards(data.cardDefinitionIds);
  const definitions: Record<string, FabRegisteredCardDefinition> = {};
  for (const id of data.cardDefinitionIds) {
    const card =
      cards.get(id) ??
      cards.get(getFleshAndBloodCard(id)?.canonicalId ?? "") ??
      [...cards.values()].find((candidate) => candidate.slug === id);
    if (!card) throw new Error(`The replay requires an unavailable card definition: ${id}`);
    definitions[id] = toFabCardDefinition(card);
  }
  const context = createFabMatchContext(definitions, fleshAndBloodPublicCardIdentities);
  const runtime = new FabMatchRuntime(restoreFabMatchSnapshot(data.snapshot, context));
  const [player1Id, player2Id] = runtime.playerIds();
  if (!player1Id || !player2Id || runtime.getState().gameEnded)
    throw new Error("Choose a position before the game ends.");
  return {
    runtime,
    engine: FabTestEngine.fromRuntime(runtime),
    player1Id,
    player2Id,
    seed: "replay-fork",
  };
}
