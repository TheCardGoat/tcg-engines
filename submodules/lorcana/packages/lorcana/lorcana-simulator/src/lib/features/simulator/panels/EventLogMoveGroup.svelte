<script lang="ts">
  import { Droplets } from "@lucide/svelte";
  import { m } from "$lib/i18n/messages.js";
  import CardLogToken from "./CardLogToken.svelte";
  import { getEventLogMarkerIcon } from "./event-log-marker-icons.js";
  import { maybeUseLorcanaSidebarPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { MoveLogEntrySnapshot } from "@/features/simulator/model/contracts.js";
  import type {
    EventLogGroup,
    EventLogPlayerTone,
  } from "./event-log-presentation.js";

  type EventGroup = Extract<EventLogGroup, { kind: "event-group" }>;

  interface Props {
    group: EventGroup;
    showRawLogRegistryJson: boolean;
    entryById: Map<string, MoveLogEntrySnapshot>;
  }

  let { group, showRawLogRegistryJson, entryById }: Props = $props();

  const sidebar = maybeUseLorcanaSidebarPresenter();

  function borderClasses(tone: EventLogPlayerTone): string {
    switch (tone) {
      case "self": return "border-emerald-400/55";
      case "opponent": return "border-rose-400/55";
      case "playerOne": return "border-sky-400/55";
      case "playerTwo": return "border-amber-400/55";
      case "system": return "border-slate-400/30";
    }
  }

  function dotClasses(tone: EventLogPlayerTone): string {
    switch (tone) {
      case "self": return "bg-emerald-400/80";
      case "opponent": return "bg-rose-400/80";
      case "playerOne": return "bg-sky-400/80";
      case "playerTwo": return "bg-amber-400/80";
      case "system": return "bg-slate-400/60";
    }
  }

  function actorTextClasses(tone: EventLogPlayerTone): string {
    switch (tone) {
      case "self": return "text-emerald-300/75";
      case "opponent": return "text-rose-300/75";
      case "playerOne": return "text-sky-300/75";
      case "playerTwo": return "text-amber-300/75";
      case "system": return "text-slate-400/80";
    }
  }

  function playerChipClasses(tone: EventLogPlayerTone): string {
    switch (tone) {
      case "self": return "border-emerald-400/45 bg-emerald-500/12 text-emerald-100";
      case "opponent": return "border-rose-400/45 bg-rose-500/12 text-rose-100";
      case "playerOne": return "border-sky-400/45 bg-sky-500/12 text-sky-100";
      case "playerTwo": return "border-amber-400/45 bg-amber-500/12 text-amber-100";
      case "system": return "border-slate-400/35 bg-slate-400/10 text-slate-200";
    }
  }
</script>

<div class="border-l-2 {borderClasses(group.actor.tone)} py-1.5 pl-3 pr-1">
  <div class="mb-1 flex items-center gap-1.5">
    <span class="h-1.5 w-1.5 shrink-0 rounded-full {dotClasses(group.actor.tone)}"></span>
    <span
      class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] {actorTextClasses(group.actor.tone)}"
    >
      {group.actor.label}
    </span>
    {#if group.isManual}
      <span
        class="rounded-sm bg-amber-500/20 px-1 py-px text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-amber-300"
      >
        {m["sim.tabletop.eventLog.manual"]({})}
      </span>
    {/if}
  </div>

  {#each group.rows as row}
    {#if showRawLogRegistryJson}
      {@const debugEntry = entryById.get(row.id)}
      {#if debugEntry}
        {@const DebugMarkerIcon = getEventLogMarkerIcon(row.marker)}
        <div class="flex gap-2 py-0.5">
          <span
            class="mt-[0.18rem] inline-flex size-3.5 shrink-0 items-center justify-center text-slate-400"
            aria-hidden="true"
          >
            <DebugMarkerIcon class="size-3.5" />
          </span>
          <div class="min-w-0 flex-1 rounded border border-slate-800/80 bg-slate-950/70 px-2 py-1.5">
            <p class="mb-1 text-[0.72rem] font-medium text-slate-200">{debugEntry.title}</p>
            <pre class="overflow-x-auto whitespace-pre-wrap break-words text-[0.66rem] leading-5 text-slate-300">{JSON.stringify(
                debugEntry,
                null,
                2,
              )}</pre>
          </div>
        </div>
      {/if}
    {:else}
      {@const MarkerIcon = getEventLogMarkerIcon(row.marker)}
      <div class="flex gap-2 py-[0.1rem]">
        <span
          class="mt-[0.18rem] inline-flex size-3.5 shrink-0 items-center justify-center text-slate-400"
          aria-hidden="true"
        >
          <MarkerIcon class="size-3.5" />
        </span>
        <p class="min-w-0 break-words text-[0.82rem] leading-[1.45] text-slate-200">
          {#each row.segments as segment}
            {#if segment.kind === "card"}
              <CardLogToken cardId={segment.cardId} />
            {:else if segment.kind === "player"}
              <span
                class={`mx-[0.06rem] inline-flex items-center rounded-full border px-1.5 py-px align-baseline text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${playerChipClasses(segment.tone)}`}
              >
                {#if segment.playerId}
                  {sidebar?.resolvePlayerName?.(segment.playerId) ?? segment.text}
                {:else}
                  {segment.text}
                {/if}
              </span>
            {:else if segment.kind === "stat"}
              <span class="font-semibold text-sky-100">{segment.text}</span>
            {:else if segment.kind === "icon"}
              <span
                class="inline-flex translate-y-[0.08rem] align-baseline text-emerald-200"
                aria-label={segment.label}
                title={segment.label}
              >
                <Droplets class="size-3.5" />
              </span>
            {:else}
              {segment.text}
            {/if}
          {/each}
        </p>
      </div>
    {/if}
  {/each}
</div>
