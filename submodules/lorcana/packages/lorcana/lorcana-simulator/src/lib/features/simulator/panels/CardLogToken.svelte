<script lang="ts">
  import {
    maybeUseSimulatorCardContext,
  } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import { maybeUseLorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import CardTextToken from "./CardTextToken.svelte";

  interface CardLogTokenProps {
    cardId: string;
    fallbackLabel?: string;
    fallbackInkType?: string[];
  }

  let { cardId, fallbackLabel, fallbackInkType }: CardLogTokenProps = $props();

  const sidebar = maybeUseLorcanaSidebarPresenter();
  const cardContext = maybeUseSimulatorCardContext();

  const shouldUseFallback = $derived(Boolean(fallbackLabel));
  const snapshot = $derived(
    shouldUseFallback ? null : (sidebar?.resolveStaticCardSnapshot?.(cardId) ?? null),
  );
  const staticName = $derived(
    shouldUseFallback ? null : (sidebar?.resolveCardName?.(cardId) ?? null),
  );
  const label = $derived(snapshot?.label ?? fallbackLabel ?? staticName ?? cardId);
  const inkType = $derived(snapshot?.inkType ?? fallbackInkType);

  function handleHover(): void {
    if (!cardContext) return;
    if (snapshot) {
      cardContext.setExternalPreviewCard(snapshot);
      return;
    }
    cardContext.setExternalPreviewCard({
      cardId,
      definitionId: cardId,
      label,
      ownerId: "",
      ownerSide: "playerOne",
      zoneId: "play",
      isMasked: shouldUseFallback,
      facePresentation: shouldUseFallback ? "faceDown" : "faceUp",
      inkType,
    });
  }

  function handleLeave(): void {
    cardContext?.setExternalPreviewCard(null);
  }
</script>

<CardTextToken card={{ label, inkType }} onHover={handleHover} onLeave={handleLeave} />
