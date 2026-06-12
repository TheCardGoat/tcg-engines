<script lang="ts">
  import { createVirtualizer } from "@tanstack/svelte-virtual";
  import { get } from "svelte/store";
  import { m } from "$lib/i18n/messages.js";
  import type { ChatMessage } from "@tcg/shared";
  import type {
    LorcanaPlayerSide,
    MoveLogEntrySnapshot,
  } from "@/features/simulator/model/contracts.js";
  import { maybeUseLorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import {
    buildActivityFeed,
    filterEntriesToLastTurns,
    type ActivityFeedGroup,
  } from "./event-log-presentation.js";
  import { shouldAutoScrollOnNewRows } from "./event-log-scroll.js";
  import EventLogTurnSeparator from "./EventLogTurnSeparator.svelte";
  import EventLogChatBubble from "./EventLogChatBubble.svelte";
  import EventLogMoveGroup from "./EventLogMoveGroup.svelte";

  interface EventLogPanelProps {
    entries: MoveLogEntrySnapshot[];
    viewerSide?: LorcanaPlayerSide | null;
    showRawLogRegistryJson?: boolean;
    compact?: boolean;
    chatMessages?: ChatMessage[];
  }

  let {
    entries,
    viewerSide = null,
    showRawLogRegistryJson = false,
    compact = false,
    chatMessages = [],
  }: EventLogPanelProps = $props();

  const sidebar = maybeUseLorcanaSidebarPresenter();

  let scrollElement = $state<HTMLDivElement | null>(null);
  let hasInitializedScroll = $state(false);
  let previousGroupCount = $state(0);
  const browser = typeof window !== "undefined";

  const visibleEntries = $derived(filterEntriesToLastTurns(entries));
  const resolveCard = $derived((cardId: string) => {
    const inkable = sidebar?.resolveCardInkable?.(cardId) ?? null;
    return inkable !== null ? { inkable } : null;
  });
  const groups = $derived(buildActivityFeed(entries, chatMessages, viewerSide, resolveCard));
  const entryById = $derived(
    new Map<string, MoveLogEntrySnapshot>(visibleEntries.map((entry) => [entry.id, entry])),
  );

  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: 0,
    estimateSize: () => 60,
    getScrollElement: () => scrollElement,
    initialRect: { width: 320, height: 720 },
    overscan: 6,
  });

  $effect(() => {
    const currentScrollElement = scrollElement;
    get(virtualizer).setOptions({
      count: groups.length,
      estimateSize: (index) => estimateGroupSize(groups[index], showRawLogRegistryJson),
      getScrollElement: () => currentScrollElement,
    });
  });

  $effect(() => {
    if (!browser || !scrollElement) {
      previousGroupCount = groups.length;
      return;
    }

    if (!hasInitializedScroll) {
      hasInitializedScroll = true;
      previousGroupCount = groups.length;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!scrollElement || groups.length === 0) return;
          get(virtualizer).scrollToIndex(groups.length - 1, { align: "end" });
          scrollElement.scrollTop = scrollElement.scrollHeight;
        });
      });
      return;
    }

    if (!shouldAutoScrollOnNewRows(groups.length, previousGroupCount)) {
      previousGroupCount = groups.length;
      return;
    }

    previousGroupCount = groups.length;

    requestAnimationFrame(() => {
      if (!scrollElement || groups.length === 0) return;
      get(virtualizer).scrollToIndex(groups.length - 1, { align: "end" });
      scrollElement.scrollTop = scrollElement.scrollHeight;
    });
  });

  function estimateGroupSize(group: ActivityFeedGroup | undefined, debugMode: boolean): number {
    if (!group) return debugMode ? 200 : 60;
    if (group.kind === "turn-separator") return 36;
    if (group.kind === "chat-message") return 72;
    return debugMode ? 28 + group.rows.length * 120 : 28 + group.rows.length * 22;
  }

  function measureVirtualRow(node: HTMLDivElement): { update: () => void; destroy: () => void } {
    if (!browser) return { update: () => {}, destroy: () => {} };

    const measure = () => get(virtualizer).measureElement(node);
    measure();

    return {
      update: measure,
      destroy: () => get(virtualizer).measureElement(null),
    };
  }
</script>

<section
  class="event-log flex min-h-0 flex-col overflow-hidden"
  aria-label={m["sim.tabletop.eventLog.aria"]({})}
>
  {#if !compact}
    <header
      class="mb-[0.3rem] flex items-center justify-between gap-[0.45rem] px-[0.2rem] pt-[0.15rem]"
    >
      <div class="min-w-0">
        <h2
          class="truncate text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#95a8c1]"
        >
          {m["sim.tabletop.eventLog.title"]({})}
        </h2>
      </div>
    </header>
  {/if}

  {#if groups.length === 0}
    <div class="flex flex-1 items-center justify-center px-[0.1rem] py-3">
      <p class="max-w-[14rem] text-center text-[0.82rem] text-slate-400">
        {m["sim.tabletop.eventLog.empty"]({})}
      </p>
    </div>
  {:else if browser && $virtualizer.getVirtualItems().length > 0}
    <div
      bind:this={scrollElement}
      class:border-t={!compact}
      class="min-h-0 flex-1 overflow-y-auto overscroll-contain border-[rgba(109,149,195,0.16)] px-[0.1rem] py-0"
    >
      <div class="relative w-full" style={`height: ${$virtualizer.getTotalSize()}px;`}>
        {#each $virtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
          {@const group = groups[virtualRow.index]}
          {#if group}
            <div
              class="absolute left-0 top-0 w-full py-0.5"
              data-index={virtualRow.index}
              style={`transform: translateY(${virtualRow.start}px);`}
              use:measureVirtualRow
            >
              {#if group.kind === "turn-separator"}
                <EventLogTurnSeparator label={group.label} />
              {:else if group.kind === "chat-message"}
                <EventLogChatBubble {group} {viewerSide} />
              {:else}
                <EventLogMoveGroup {group} {showRawLogRegistryJson} {entryById} />
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {:else}
    <div
      class:border-t={!compact}
      class="min-h-0 flex-1 overflow-y-auto overscroll-contain border-[rgba(109,149,195,0.16)] px-[0.1rem] py-0"
    >
      {#each groups as group (group.id)}
        <div class="py-0.5">
          {#if group.kind === "turn-separator"}
            <EventLogTurnSeparator label={group.label} />
          {:else if group.kind === "chat-message"}
            <EventLogChatBubble {group} {viewerSide} />
          {:else}
            <EventLogMoveGroup {group} {showRawLogRegistryJson} {entryById} />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
