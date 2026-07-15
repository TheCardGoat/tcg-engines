<script lang="ts">
  import { Badge } from '$lib/design-system/primitives/badge';
  import { Button } from '$lib/design-system/primitives/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/design-system/primitives/card';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '$lib/design-system/primitives/dropdown-menu';
  import {
    m,
    simMatchmakingArchetypeIntro,
    simMatchmakingArchetypeUserMatchesTitle,
  } from '$lib/i18n/messages.js';
  import {
    DECK_FIXTURES,
    type DeckFixture,
  } from '@/features/simulator-devtools/deck-fixtures/index.js';
  import { getInkSymbolUrl } from '@/features/simulator/model/asset-urls.js';
  import {
    LORCANA_INK_NAMES,
    type LorcanaInkName,
  } from '@/features/simulator/model/lorcana-colors.js';
  import { cn } from '$lib/utils.js';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import InfinityIcon from '@lucide/svelte/icons/infinity';
  import Layers from '@lucide/svelte/icons/layers';

  type ConstructedFormat = 'core' | 'infinity';

  type CreatedMatch = {
    id: string;
    host: string;
    archetypeId: string;
    constructedFormat: ConstructedFormat;
    format: 'Bo1' | 'Bo3';
    status: 'open' | 'drafting';
    players: string;
    createdAt: string;
  };

  type InkPairOption = {
    id: string;
    inks: readonly [LorcanaInkName, LorcanaInkName];
  };

  interface DeckOption {
    id: string;
    name: string;
    cardCount: number;
    inks: LorcanaInkName[];
  }

  const knownInkTokens = new Set<string>(LORCANA_INK_NAMES);

  /** Inks from fixture slug (e.g. `steel-sapphire-midrange` → steel, sapphire). */
  function inksFromDeckFixture(fixture: DeckFixture): LorcanaInkName[] {
    const inks: LorcanaInkName[] = [];
    for (const part of fixture.id.toLowerCase().split('-')) {
      if (knownInkTokens.has(part)) {
        const ink = part as LorcanaInkName;
        if (!inks.includes(ink)) {
          inks.push(ink);
          if (inks.length >= 2) break;
        }
      }
    }
    return inks;
  }

  function createDeckId(name: string, index: number): string {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `${normalized.length > 0 ? normalized : 'deck'}-${index + 1}`;
  }

  function extractDeckCardCount(deckList: string): number {
    return deckList
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .reduce((total, line) => {
        const quantityToken = line.split(/\s+/, 1)[0];
        const quantity = Number.parseInt(quantityToken ?? '', 10);
        return Number.isNaN(quantity) ? total + 1 : total + quantity;
      }, 0);
  }

  const deckOptions: DeckOption[] = DECK_FIXTURES.map((deck, index) => ({
    id: createDeckId(deck.name, index),
    name: deck.name,
    cardCount: extractDeckCardCount(deck.cards),
    inks: inksFromDeckFixture(deck),
  }));

  const laneClass =
    'overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] shadow-[0_32px_80px_-52px_rgba(2,6,23,0.95)]';
  const laneScrollClass =
    'space-y-4 px-4 py-5 sm:px-5 xl:h-full xl:overflow-y-auto [scrollbar-color:rgba(148,163,184,0.5)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25';
  const surfaceCardClass =
    'border-white/10 bg-slate-950/72 shadow-[0_24px_48px_-32px_rgba(15,23,42,0.92)] backdrop-blur-sm';
  const eyebrowClass =
    'text-muted-foreground text-xs font-semibold uppercase tracking-[0.24em]';

  const comboboxTriggerClass =
    'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-left text-sm text-slate-100 shadow-xs outline-none transition hover:bg-white/10 focus-visible:ring-[3px] focus-visible:ring-sky-400/40';

  /** All official two-ink pairings (6 choose 2 = 15). IDs use alphabetical ink order. */
  const inkPairOptions: InkPairOption[] = (() => {
    const names = [...LORCANA_INK_NAMES];
    const pairs: InkPairOption[] = [];
    for (let i = 0; i < names.length; i += 1) {
      for (let j = i + 1; j < names.length; j += 1) {
        const a = names[i];
        const b = names[j];
        if (!a || !b) continue;
        const sorted = [a, b].slice().sort((x, y) => x.localeCompare(y));
        const first = sorted[0];
        const second = sorted[1];
        if (!first || !second) continue;
        pairs.push({
          id: `${first}-${second}`,
          inks: [first, second],
        });
      }
    }
    return pairs;
  })();

  type MatchSeriesFormat = 'Bo1' | 'Bo3';

  type FormatLaneOption = {
    id: string;
    constructedFormat: ConstructedFormat;
    matchFormat: MatchSeriesFormat;
    /** e.g. Infinity Bo3 */
    label: string;
  };

  const formatLaneOptions: FormatLaneOption[] = [
    {
      id: 'infinity-bo1',
      constructedFormat: 'infinity',
      matchFormat: 'Bo1',
      label: 'Infinity Bo1',
    },
    {
      id: 'infinity-bo3',
      constructedFormat: 'infinity',
      matchFormat: 'Bo3',
      label: 'Infinity Bo3',
    },
    {
      id: 'core-bo1',
      constructedFormat: 'core',
      matchFormat: 'Bo1',
      label: 'Core Bo1',
    },
    {
      id: 'core-bo3',
      constructedFormat: 'core',
      matchFormat: 'Bo3',
      label: 'Core Bo3',
    },
  ];

  function formatLaneLabel(
    constructed: ConstructedFormat,
    matchFormat: MatchSeriesFormat,
  ): string {
    const prefix = constructed === 'core' ? 'Core' : 'Infinity';
    return `${prefix} ${matchFormat}`;
  }

  const createdMatches: CreatedMatch[] = [
    {
      id: 'm-archetype-102',
      host: 'Michele',
      archetypeId: 'amethyst-ruby',
      constructedFormat: 'infinity',
      format: 'Bo3',
      status: 'open',
      players: '1 / 2',
      createdAt: '2 min ago',
    },
    {
      id: 'm-archetype-097',
      host: 'Giulia',
      archetypeId: 'amber-steel',
      constructedFormat: 'core',
      format: 'Bo1',
      status: 'drafting',
      players: '1 / 2',
      createdAt: '7 min ago',
    },
    {
      id: 'm-archetype-091',
      host: 'Luca',
      archetypeId: 'sapphire-steel',
      constructedFormat: 'infinity',
      format: 'Bo3',
      status: 'open',
      players: '1 / 2',
      createdAt: '11 min ago',
    },
  ];

  let selectedDeckId = $state(deckOptions[0]?.id ?? '');
  let selectedArchetype = $state(inkPairOptions[0]?.id ?? '');
  let selectedFormatLaneId = $state(
    formatLaneOptions.find((o) => o.id === 'infinity-bo3')?.id ?? formatLaneOptions[0]?.id ?? '',
  );

  const selectedDeck = $derived(
    deckOptions.find((deck) => deck.id === selectedDeckId) ?? null,
  );

  const canCreate = $derived(selectedDeck !== null);
  const selectedInkPair = $derived(
    inkPairOptions.find((option) => option.id === selectedArchetype) ??
      inkPairOptions[0],
  );
  const selectedFormatLane = $derived(
    formatLaneOptions.find((o) => o.id === selectedFormatLaneId) ??
      formatLaneOptions.find((o) => o.id === 'infinity-bo3') ??
      formatLaneOptions[0],
  );

  function inkLabel(ink: LorcanaInkName): string {
    return ink.charAt(0).toUpperCase() + ink.slice(1);
  }

  function resetForm() {
    selectedDeckId = deckOptions[0]?.id ?? '';
    selectedArchetype = inkPairOptions[0]?.id ?? '';
    selectedFormatLaneId =
      formatLaneOptions.find((o) => o.id === 'infinity-bo3')?.id ??
      formatLaneOptions[0]?.id ??
      '';
  }
</script>

<div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-3 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-4 lg:gap-5">
  <section class="rounded-[2rem] border border-white/10 bg-slate-950/60 px-4 py-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,1)] backdrop-blur-sm sm:px-6 sm:py-6">
    <p class={eyebrowClass}>Matchmaking</p>
    <h1 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
      Archetype Matchmaking
    </h1>
    <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
      {simMatchmakingArchetypeIntro({})}
    </p>
  </section>

  <div
    class="grid min-h-0 flex-1 gap-4 lg:min-h-0 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]"
  >
    <section class={cn(laneClass, 'min-h-0 lg:min-h-0')}>
      <div class={laneScrollClass}>
        <Card class={cn(surfaceCardClass, 'overflow-hidden border-amber-500/20')}>
          <CardHeader class="border-b border-white/10">
            <CardTitle class="scroll-m-20 text-2xl tracking-tight">
              Create New Match
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-5">
            <div class="space-y-2">
              <span class={cn(eyebrowClass, 'block')} id="archetype-deck-combobox-label">
                {m['sim.matchmaking.deckSelect.label']({})}
              </span>
              {#if deckOptions.length === 0}
                <p class="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">
                  {m['sim.matchmaking.deckSelect.none']({})}
                </p>
              {:else}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    class={comboboxTriggerClass}
                    aria-labelledby="archetype-deck-combobox-label"
                  >
                    <span class="flex min-w-0 flex-1 items-center gap-2">
                      {#if selectedDeck}
                        {#each selectedDeck.inks as ink}
                          <img
                            src={getInkSymbolUrl(ink)}
                            alt={inkLabel(ink)}
                            title={inkLabel(ink)}
                            class="size-7 shrink-0 object-contain"
                            width="28"
                            height="28"
                          />
                        {/each}
                        <span class="truncate text-slate-200">{selectedDeck.name}</span>
                      {:else}
                        <span class="text-slate-400">{m['sim.matchmaking.deckSelect.none']({})}</span>
                      {/if}
                    </span>
                    <ChevronDown
                      class="size-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    class="max-h-72 w-[min(100vw-2rem,var(--bits-dropdown-menu-anchor-width))] overflow-y-auto rounded-xl border border-white/10 bg-slate-950/98 p-1 shadow-xl backdrop-blur-xl sm:w-[var(--bits-dropdown-menu-anchor-width)]"
                  >
                    {#each deckOptions as deck}
                      <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 data-highlighted:bg-white/10"
                        onSelect={() => {
                          selectedDeckId = deck.id;
                        }}
                      >
                        {#each deck.inks as ink}
                          <img
                            src={getInkSymbolUrl(ink)}
                            alt=""
                            aria-hidden="true"
                            class="size-7 shrink-0 object-contain"
                            width="28"
                            height="28"
                          />
                        {/each}
                        <span class="flex min-w-0 flex-1 flex-col text-left">
                          <span class="truncate text-sm text-slate-100">{deck.name}</span>
                          <span class="text-xs text-slate-400">
                            {m['sim.matchmaking.selectedDeck.cardsLoaded']({
                              count: deck.cardCount,
                            })}
                          </span>
                        </span>
                      </DropdownMenuItem>
                    {/each}
                  </DropdownMenuContent>
                </DropdownMenu>
              {/if}
            </div>

            {#if selectedDeck}
              <div
                class="rounded-xl border border-white/10 bg-white/5 p-4"
                aria-live="polite"
              >
                <p class={eyebrowClass}>
                  {m['sim.matchmaking.selectedDeck.kicker']({})}
                </p>
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  {#each selectedDeck.inks as ink}
                    <img
                      src={getInkSymbolUrl(ink)}
                      alt={inkLabel(ink)}
                      title={inkLabel(ink)}
                      class="size-9 shrink-0 object-contain drop-shadow-sm"
                      width="36"
                      height="36"
                    />
                  {/each}
                </div>
                <h3 class="mt-3 scroll-m-20 text-xl font-semibold tracking-tight text-white">
                  {selectedDeck.name}
                </h3>
                <p class="text-muted-foreground mt-2 text-sm leading-6">
                  {m['sim.matchmaking.selectedDeck.cardsLoaded']({
                    count: selectedDeck.cardCount,
                  })}
                </p>
              </div>
            {/if}

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2 sm:col-span-2">
                <span class={cn(eyebrowClass, 'block')} id="archetype-combobox-label">
                  Archetype
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    class={comboboxTriggerClass}
                    aria-labelledby="archetype-combobox-label"
                  >
                    <span class="flex min-w-0 flex-1 items-center gap-2">
                      {#if selectedInkPair}
                        {#each selectedInkPair.inks as ink}
                          <img
                            src={getInkSymbolUrl(ink)}
                            alt=""
                            aria-hidden="true"
                            class="size-7 shrink-0 object-contain"
                            width="28"
                            height="28"
                          />
                        {/each}
                        <span class="truncate text-slate-200">
                          {inkLabel(selectedInkPair.inks[0])} + {inkLabel(
                            selectedInkPair.inks[1],
                          )}
                        </span>
                      {:else}
                        <span class="text-slate-400">Select a pairing</span>
                      {/if}
                    </span>
                    <ChevronDown
                      class="size-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    class="max-h-72 w-[min(100vw-2rem,var(--bits-dropdown-menu-anchor-width))] overflow-y-auto rounded-xl border border-white/10 bg-slate-950/98 p-1 shadow-xl backdrop-blur-xl sm:w-[var(--bits-dropdown-menu-anchor-width)]"
                  >
                    {#each inkPairOptions as pair}
                      <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 data-highlighted:bg-white/10"
                        onSelect={() => {
                          selectedArchetype = pair.id;
                        }}
                      >
                        {#each pair.inks as ink}
                          <img
                            src={getInkSymbolUrl(ink)}
                            alt=""
                            aria-hidden="true"
                            class="size-7 shrink-0 object-contain"
                            width="28"
                            height="28"
                          />
                        {/each}
                        <span class="text-sm text-slate-100">
                          {inkLabel(pair.inks[0])} + {inkLabel(pair.inks[1])}
                        </span>
                      </DropdownMenuItem>
                    {/each}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div class="space-y-2 sm:col-span-2">
                <span class={cn(eyebrowClass, 'block')} id="format-lane-label">
                  Format
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    class={comboboxTriggerClass}
                    aria-labelledby="format-lane-label"
                  >
                    <span class="flex min-w-0 flex-1 items-center gap-2">
                      {#if selectedFormatLane}
                        {#if selectedFormatLane.constructedFormat === 'core'}
                          <Layers class="size-4 shrink-0 text-slate-300" aria-hidden="true" />
                        {:else}
                          <InfinityIcon
                            class="size-4 shrink-0 text-slate-300"
                            aria-hidden="true"
                          />
                        {/if}
                        <span class="truncate font-medium text-slate-100">
                          {selectedFormatLane.label}
                        </span>
                      {:else}
                        <span class="text-slate-400">Select format</span>
                      {/if}
                    </span>
                    <ChevronDown
                      class="size-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    class="w-[min(100vw-2rem,var(--bits-dropdown-menu-anchor-width))] rounded-xl border border-white/10 bg-slate-950/98 p-1 shadow-xl backdrop-blur-xl sm:w-[var(--bits-dropdown-menu-anchor-width)]"
                  >
                    {#each formatLaneOptions as lane}
                      <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 data-highlighted:bg-white/10"
                        onSelect={() => {
                          selectedFormatLaneId = lane.id;
                        }}
                      >
                        {#if lane.constructedFormat === 'core'}
                          <Layers class="size-4 text-slate-300" aria-hidden="true" />
                        {:else}
                          <InfinityIcon class="size-4 text-slate-300" aria-hidden="true" />
                        {/if}
                        <span class="text-sm font-medium text-slate-100">{lane.label}</span>
                      </DropdownMenuItem>
                    {/each}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <Button class="h-11 flex-1 text-base" disabled={!canCreate}>
                Create match
              </Button>
              <Button
                variant="outline"
                class="h-11 flex-1 text-base"
                onclick={resetForm}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <aside class={cn(laneClass, 'min-h-0 lg:min-h-0')}>
      <div class={laneScrollClass}>
        <Card class={surfaceCardClass}>
          <CardHeader>
            <CardTitle class="scroll-m-20 text-2xl tracking-tight">
              {simMatchmakingArchetypeUserMatchesTitle({})}
            </CardTitle>
            <CardDescription class="leading-7">
              Join a room already tagged with an archetype.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            {#each createdMatches as match}
              {@const matchPair = inkPairOptions.find(
                (option) => option.id === match.archetypeId,
              )}
              <article
                class="rounded-xl border border-white/12 bg-slate-950/85 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-black/20"
                aria-label="Match hosted by {match.host}"
              >
                <div class="space-y-3">
                  <div class="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        {#if matchPair}
                          {#each matchPair.inks as ink}
                            <img
                              src={getInkSymbolUrl(ink)}
                              alt={inkLabel(ink)}
                              title={inkLabel(ink)}
                              class="size-8 shrink-0 object-contain drop-shadow-sm"
                              width="32"
                              height="32"
                            />
                          {/each}
                        {:else}
                          <span class="text-sm text-slate-400">Unknown inks</span>
                        {/if}
                      </div>
                      <p class="text-muted-foreground text-xs">
                        Host: {match.host}
                      </p>
                    </div>
                    <Badge variant={match.status === 'open' ? 'secondary' : 'outline'}>
                      {match.status}
                    </Badge>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <Badge variant="outline">
                      {formatLaneLabel(match.constructedFormat, match.format)}
                    </Badge>
                    <Badge variant="outline">{match.players}</Badge>
                    <span class="text-slate-400">{match.createdAt}</span>
                  </div>
                  <Button variant="outline" class="h-9 w-full">
                    Join room
                  </Button>
                </div>
              </article>
            {/each}
          </CardContent>
        </Card>
      </div>
    </aside>
  </div>
</div>
