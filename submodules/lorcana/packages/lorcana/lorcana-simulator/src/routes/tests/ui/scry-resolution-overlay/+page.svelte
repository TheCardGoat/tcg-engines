<script lang="ts">
  import { setContext } from 'svelte';

  import ScryResolutionOverlay from '@/features/simulator/board/ScryResolutionOverlay.svelte';
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
  } from '@/features/simulator/model/contracts.js';
  import type {
    PlayerInteractionView,
    PromptScryDestination,
    PromptScryRevealedCard,
  } from '@tcg/lorcana-interaction';

  // The overlay calls `useSimulatorCardContext()` (throws if absent). We stub
  // it with the minimum surface the overlay touches: setExternalPreviewCard,
  // openGlobalPreview, previewCard. CardInteractionContext is left unset so
  // LorcanaCard short-circuits its hover/select handlers.
  const SIMULATOR_CARD_CONTEXT_KEY = Symbol.for('lorcana.simulator-card');
  setContext(SIMULATOR_CARD_CONTEXT_KEY, {
    hoveredCard: null,
    externalPreviewCard: null,
    inspectedCard: null,
    inspectedMeta: null,
    pinnedPreviewCard: null,
    selectedIds: [],
    selectionMode: 'none' as const,
    previewPosition: { x: 0, y: 0 },
    isInspectOpen: false,
    isGlobalPreviewOpen: false,
    canSelectCard: () => false,
    canSelectInspectedCard: false,
    previewCard: null,
    setExternalPreviewCard: () => {},
    setPreviewPosition: () => {},
    handleHover: () => {},
    handleLeave: () => {},
    handleSelect: () => {},
    openCardInspect: () => {},
    closeCardInspect: () => {},
    openGlobalPreview: () => {},
    closeGlobalPreview: () => {},
    selectInspectedCard: () => {},
  });

  type ScryFixture = {
    title: string;
    description: string;
    sourceCard?: LorcanaCardSnapshot | null;
    revealed: PromptScryRevealedCard[];
    destinations: PromptScryDestination[];
    canSubmit?: boolean;
  };

  function makeRevealed(
    cardId: string,
    label: string,
    placement: { destinationId: string; orderIndex: number } | null = null,
    eligibleDestinationIds: string[] = [],
  ): PromptScryRevealedCard {
    return {
      cardId: cardId as unknown as PromptScryRevealedCard['cardId'],
      label,
      currentDestinationId: placement?.destinationId ?? null,
      orderIndex: placement?.orderIndex ?? null,
      eligibleDestinationIds,
    };
  }

  type CardSpec = {
    cardId: string;
    label: string;
    set: string;
    cardNumber: number;
    cardType?: LorcanaCardSnapshot['cardType'];
  };

  // Real Lorcana cards — set+cardNumber resolves to live R2 art.
  const CARDS: Record<string, CardSpec> = {
    mickeyBraveTailor: {
      cardId: 'card-mickey-brave-tailor',
      label: 'Mickey Mouse - Brave Little Tailor',
      set: '001',
      cardNumber: 115,
      cardType: 'character',
    },
    stitchCarefreeSurfer: {
      cardId: 'card-stitch-carefree',
      label: 'Stitch - Carefree Surfer',
      set: '001',
      cardNumber: 21,
      cardType: 'character',
    },
    mauiHeroToAll: {
      cardId: 'card-maui-hero',
      label: 'Maui - Hero to All',
      set: '001',
      cardNumber: 114,
      cardType: 'character',
    },
    belleStrangeButSpecial: {
      cardId: 'card-belle-strange',
      label: 'Belle - Strange but Special',
      set: '001',
      cardNumber: 142,
      cardType: 'character',
    },
    tinkerBellGenerous: {
      cardId: 'card-tinker-generous',
      label: 'Tinker Bell - Generous Fairy',
      set: '003',
      cardNumber: 22,
      cardType: 'character',
    },
    hadesKingOfOlympus: {
      cardId: 'card-hades-king',
      label: 'Hades - King of Olympus',
      set: '001',
      cardNumber: 5,
      cardType: 'character',
    },
    beastWounded: {
      cardId: 'card-beast-wounded',
      label: 'Beast - Wounded',
      set: '004',
      cardNumber: 103,
      cardType: 'character',
    },
    tipoGrowingSon: {
      cardId: 'card-tipo-growing',
      label: 'Tipo - Growing Son',
      set: '005',
      cardNumber: 157,
      cardType: 'character',
    },
    hiddenCove: {
      cardId: 'card-hidden-cove',
      label: 'Hidden Cove - Tranquil Haven',
      set: '004',
      cardNumber: 101,
      cardType: 'location',
    },
    magicMirror: {
      cardId: 'card-magic-mirror',
      label: 'Magic Mirror',
      set: '001',
      cardNumber: 66,
      cardType: 'item',
    },
    friendsOnTheOtherSide: {
      cardId: 'card-friends-other-side',
      label: 'Friends on the Other Side',
      set: '001',
      cardNumber: 64,
      cardType: 'action',
    },
    bePrepared: {
      cardId: 'card-be-prepared',
      label: 'Be Prepared',
      set: '001',
      cardNumber: 128,
      cardType: 'action',
    },
    captainHookHappyThought: {
      cardId: 'card-hook-happy-thought',
      label: 'Captain Hook - Thinking a Happy Thought',
      set: '001',
      cardNumber: 175,
      cardType: 'character',
    },
  } as const;

  function fromSpec(spec: CardSpec): LorcanaCardSnapshot {
    return {
      cardId: spec.cardId,
      definitionId: `${spec.set}-${String(spec.cardNumber).padStart(3, '0')}`,
      isMasked: false,
      label: spec.label,
      ownerId: 'p1',
      ownerSide: 'self' as LorcanaPlayerSide,
      zoneId: 'deck' as never,
      facePresentation: 'face-up' as never,
      cardType: spec.cardType,
      set: spec.set,
      cardNumber: spec.cardNumber,
    };
  }

  function fromSpecAsSource(
    spec: CardSpec,
    overrideId = 'source-card',
  ): LorcanaCardSnapshot {
    return {
      ...fromSpec(spec),
      cardId: overrideId,
      zoneId: 'play' as never,
    };
  }

  function revealedFromSpec(
    spec: CardSpec,
    placement: { destinationId: string; orderIndex: number } | null = null,
  ): PromptScryRevealedCard {
    return makeRevealed(spec.cardId, spec.label, placement);
  }

  function makeDestination(
    overrides: Partial<PromptScryDestination> & {
      id: string;
      zone: string;
      label: string;
    },
  ): PromptScryDestination {
    return {
      min: 0,
      max: null,
      remainder: false,
      orderingEnabled: true,
      currentCardIds: [] as unknown as PromptScryDestination['currentCardIds'],
      ...overrides,
    } as PromptScryDestination;
  }

  // ---------- Fixture catalogue ----------

  const fixtures: ScryFixture[] = [
    {
      title: '1. Default — top + remainder, nothing assigned',
      description:
        'Two destinations (deck-top + deck-bottom remainder), three revealed cards still in the strip.',
      sourceCard: fromSpecAsSource(CARDS.belleStrangeButSpecial),
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor),
        revealedFromSpec(CARDS.stitchCarefreeSurfer),
        revealedFromSpec(CARDS.mauiHeroToAll),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '2. Mid-flight — one card placed on top, two remaining',
      description:
        'Mirrors the engine state after the chooser taps a single card onto the top destination.',
      sourceCard: fromSpecAsSource(CARDS.hiddenCove),
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor, {
          destinationId: 'deck-top',
          orderIndex: 0,
        }),
        revealedFromSpec(CARDS.stitchCarefreeSurfer),
        revealedFromSpec(CARDS.mauiHeroToAll),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
          currentCardIds: [
            CARDS.mickeyBraveTailor.cardId,
          ] as unknown as PromptScryDestination['currentCardIds'],
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '3. Fully ordered — three on top, ordering visible',
      description:
        'Demonstrates the "Drawn first / Drawn last" ordering hints that appear when ≥2 cards are present and ordering is enabled.',
      sourceCard: fromSpecAsSource(CARDS.captainHookHappyThought),
      revealed: [
        revealedFromSpec(CARDS.belleStrangeButSpecial, {
          destinationId: 'deck-top',
          orderIndex: 0,
        }),
        revealedFromSpec(CARDS.stitchCarefreeSurfer, {
          destinationId: 'deck-top',
          orderIndex: 1,
        }),
        revealedFromSpec(CARDS.mauiHeroToAll, {
          destinationId: 'deck-top',
          orderIndex: 2,
        }),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
          currentCardIds: [
            CARDS.belleStrangeButSpecial.cardId,
            CARDS.stitchCarefreeSurfer.cardId,
            CARDS.mauiHeroToAll.cardId,
          ] as unknown as PromptScryDestination['currentCardIds'],
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '4. Three destinations — top / hand / bottom',
      description:
        'Top of deck (ordered), hand (no ordering, finite max=1), and bottom-of-deck remainder.',
      sourceCard: fromSpecAsSource(CARDS.tipoGrowingSon),
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor, {
          destinationId: 'deck-top',
          orderIndex: 0,
        }),
        revealedFromSpec(CARDS.stitchCarefreeSurfer, {
          destinationId: 'hand',
          orderIndex: 0,
        }),
        revealedFromSpec(CARDS.mauiHeroToAll),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
          currentCardIds: [
            CARDS.mickeyBraveTailor.cardId,
          ] as unknown as PromptScryDestination['currentCardIds'],
        }),
        makeDestination({
          id: 'hand',
          zone: 'hand',
          label: 'Your hand',
          max: 1,
          orderingEnabled: false,
          currentCardIds: [
            CARDS.stitchCarefreeSurfer.cardId,
          ] as unknown as PromptScryDestination['currentCardIds'],
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '5. Inkwell scry — non-ordered destination',
      description:
        'Uses orderingEnabled=false to show the "grouped (no order)" placeholder copy and hides the ordering hints.',
      sourceCard: fromSpecAsSource(CARDS.magicMirror),
      revealed: [
        revealedFromSpec(CARDS.bePrepared),
        revealedFromSpec(CARDS.friendsOnTheOtherSide),
      ],
      destinations: [
        makeDestination({
          id: 'inkwell',
          zone: 'inkwell',
          label: 'Inkwell (face-down)',
          orderingEnabled: false,
        }),
        makeDestination({
          id: 'discard',
          zone: 'discard',
          label: 'Discard pile',
          remainder: true,
          orderingEnabled: false,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '6. Many cards (5) — wraps / scrolls in the strip',
      description:
        'Stress test with five revealed cards to surface wrap behaviour on desktop and horizontal scroll on mobile.',
      sourceCard: fromSpecAsSource(CARDS.beastWounded),
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor),
        revealedFromSpec(CARDS.stitchCarefreeSurfer),
        revealedFromSpec(CARDS.mauiHeroToAll),
        revealedFromSpec(CARDS.belleStrangeButSpecial),
        revealedFromSpec(CARDS.tinkerBellGenerous),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '7. Cannot submit — no remainder, unassigned cards',
      description:
        'Both destinations are non-remainder; with cards still unassigned the confirm button is disabled.',
      sourceCard: fromSpecAsSource(CARDS.friendsOnTheOtherSide),
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor),
        revealedFromSpec(CARDS.stitchCarefreeSurfer),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
        }),
      ],
      canSubmit: false,
    },
    {
      title: '8. Single destination — deck-bottom only',
      description:
        'Single ordered destination labelled "Bottom of deck" — exercises the deck-bottom-specific drawn-first/last copy.',
      sourceCard: fromSpecAsSource(CARDS.hadesKingOfOlympus),
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor, {
          destinationId: 'deck-bottom',
          orderIndex: 0,
        }),
        revealedFromSpec(CARDS.stitchCarefreeSurfer, {
          destinationId: 'deck-bottom',
          orderIndex: 1,
        }),
      ],
      destinations: [
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
          currentCardIds: [
            CARDS.mickeyBraveTailor.cardId,
            CARDS.stitchCarefreeSurfer.cardId,
          ] as unknown as PromptScryDestination['currentCardIds'],
        }),
      ],
      canSubmit: true,
    },
    {
      title: '9. No source card — overlay falls back to generic title',
      description:
        'Hides the source-card thumbnail/preview button so the header collapses to just the title and subtitle.',
      sourceCard: null,
      revealed: [
        revealedFromSpec(CARDS.mickeyBraveTailor),
        revealedFromSpec(CARDS.stitchCarefreeSurfer),
        revealedFromSpec(CARDS.mauiHeroToAll),
      ],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '10. Filtered destination — only some cards eligible',
      description:
        '"To play" only accepts actions of cost ≤ 6 (Robin Hood-style). Eligible cards in the remainder zone glow; ineligible ones dim out.',
      sourceCard: fromSpecAsSource(CARDS.friendsOnTheOtherSide, 'src-robin'),
      revealed: [
        // Friends on the Other Side: action, cost 5 → eligible for "to-play".
        makeRevealed(
          CARDS.friendsOnTheOtherSide.cardId,
          CARDS.friendsOnTheOtherSide.label,
          null,
          ['to-play', 'to-discard'],
        ),
        // Be Prepared: action, cost 7 → only "to-discard".
        makeRevealed(
          CARDS.bePrepared.cardId,
          CARDS.bePrepared.label,
          null,
          ['to-discard'],
        ),
        // Characters are not actions → only "to-discard".
        makeRevealed(
          CARDS.mauiHeroToAll.cardId,
          CARDS.mauiHeroToAll.label,
          null,
          ['to-discard'],
        ),
        makeRevealed(
          CARDS.mickeyBraveTailor.cardId,
          CARDS.mickeyBraveTailor.label,
          null,
          ['to-discard'],
        ),
      ],
      destinations: [
        makeDestination({
          id: 'to-play',
          zone: 'play',
          label: 'to play',
          max: 1,
          orderingEnabled: false,
        }),
        makeDestination({
          id: 'to-discard',
          zone: 'discard',
          label: 'to discard',
          remainder: true,
          orderingEnabled: false,
        }),
      ],
      canSubmit: true,
    },
    {
      title: '11. Empty revealed — destinations only',
      description:
        'Edge case: revealed strip is empty, all rows show their placeholder copy.',
      sourceCard: fromSpecAsSource(CARDS.belleStrangeButSpecial),
      revealed: [],
      destinations: [
        makeDestination({
          id: 'deck-top',
          zone: 'deck-top',
          label: 'Top of deck',
        }),
        makeDestination({
          id: 'deck-bottom',
          zone: 'deck-bottom',
          label: 'Bottom of deck',
          remainder: true,
        }),
      ],
      canSubmit: true,
    },
  ];

  const SPECS_BY_CARD_ID = new Map<string, CardSpec>(
    Object.values(CARDS).map((spec) => [spec.cardId, spec]),
  );

  function buildView(fixture: ScryFixture): {
    view: PlayerInteractionView;
    cardSnapshotsById: Record<string, LorcanaCardSnapshot>;
  } {
    const sourceCardId = fixture.sourceCard?.cardId ?? 'no-source';
    const cardSnapshotsById: Record<string, LorcanaCardSnapshot> = {};
    if (fixture.sourceCard) {
      cardSnapshotsById[fixture.sourceCard.cardId] = fixture.sourceCard;
    }
    for (const entry of fixture.revealed) {
      const cardId = String(entry.cardId);
      const spec = SPECS_BY_CARD_ID.get(cardId);
      if (spec) {
        cardSnapshotsById[cardId] = fromSpec(spec);
      }
    }

    // Default eligibility: every destination accepts every card (no filters).
    // Fixtures that want to demo per-card legality override this list per card.
    const allDestinationIds = fixture.destinations.map((d) => d.id);
    const revealedWithEligibility = fixture.revealed.map((entry) =>
      entry.eligibleDestinationIds.length > 0
        ? entry
        : { ...entry, eligibleDestinationIds: allDestinationIds },
    );

    const view = {
      viewerId: 'p1',
      viewerRole: 'chooser',
      activePrompt: {
        requestId: `req-${sourceCardId}`,
        kind: 'scry-selection',
        chooserId: 'p1',
        controllerId: 'p1',
        sourceCardId: sourceCardId as unknown,
        expectedSlottedKind: null,
        activeSlotIndex: null,
        slots: null,
        autoResolvedSlotCount: 0,
        minSelections: 0,
        maxSelections: fixture.revealed.length,
        declaredMaxSelections: null,
        autoRejected: false,
        scryDestinations: fixture.destinations,
        scryRevealed: revealedWithEligibility,
      },
      surface: 'scry-overlay',
      interactions: [],
      submission: {
        requestId: `req-${sourceCardId}`,
        canSubmit: fixture.canSubmit ?? true,
        canCancel: true,
        autoRejected: false,
        submitPayload: null,
        cancelPayload: null,
      },
      copy: {} as never,
      promptQueue: [],
      activeQueueIndex: 0,
      rawContext: null,
    } as unknown as PlayerInteractionView;

    return { view, cardSnapshotsById };
  }

  const cases = fixtures.map((fixture) => ({
    fixture,
    ...buildView(fixture),
  }));

  function noopAssign(): boolean {
    return false;
  }

  function noopReorder(): boolean {
    return false;
  }

  function noopConfirm(): boolean {
    return false;
  }

  function noopDismiss(): void {}
</script>

<div class="page">
  <header class="page-header">
    <h1>ScryResolutionOverlay — permutations</h1>
    <p>
      Visual catalogue of valid <code>ScryResolutionOverlay</code> states for design
      iteration. Each tile sets up an isolated <code>position: relative</code> stage
      so the overlay's centred-absolute positioning lands inside its own frame.
      Drag-and-drop and engine submission are stubbed to no-ops.
    </p>
  </header>

  <div class="grid">
    {#each cases as { fixture, view, cardSnapshotsById } (fixture.title)}
      <article class="case">
        <header class="case-header">
          <h2>{fixture.title}</h2>
          <p>{fixture.description}</p>
        </header>
        <div class="stage">
          <ScryResolutionOverlay
            {view}
            {cardSnapshotsById}
            viewerSide={'self' as LorcanaPlayerSide}
            onAssignCard={noopAssign}
            onReorderCard={noopReorder}
            onConfirm={noopConfirm}
            onDismiss={noopDismiss}
          />
        </div>
      </article>
    {/each}
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    padding: 1.5rem;
    background: #0b1416;
    color: #edf7ef;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      'Segoe UI',
      sans-serif;
  }

  .page-header {
    max-width: 60rem;
    margin: 0 auto 1.5rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
    font-size: 1.4rem;
  }

  .page-header p {
    margin: 0;
    font-size: 0.85rem;
    color: rgba(225, 240, 228, 0.7);
    line-height: 1.5;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(38rem, 1fr));
    gap: 1.25rem;
  }

  .case {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: 1rem;
    border: 1px solid rgba(190, 225, 195, 0.18);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.025);
  }

  .case-header h2 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .case-header p {
    margin: 0;
    font-size: 0.78rem;
    color: rgba(225, 240, 228, 0.65);
    line-height: 1.45;
  }

  .stage {
    position: relative;
    width: 100%;
    height: 42rem;
    overflow: hidden;
    border: 1px dashed rgba(190, 225, 195, 0.18);
    border-radius: 0.85rem;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(58, 90, 78, 0.4),
        transparent 60%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(40, 70, 90, 0.45),
        transparent 65%
      ),
      #07120e;
  }

  code {
    padding: 0.05rem 0.3rem;
    border-radius: 0.3rem;
    background: rgba(255, 255, 255, 0.06);
    font-size: 0.78em;
  }
</style>
