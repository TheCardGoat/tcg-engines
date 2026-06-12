<script lang="ts">
    import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import type { LorcanaCardTag } from "./card-tags.js";

  interface CardTagStripProps {
    tags: LorcanaCardTag[];
    maxVisible?: number;
    compact?: boolean;
    collapseMode?: "none" | "hover-stack";
    class?: string;
  }

  let {
    tags,
    maxVisible,
    compact = false,
    collapseMode = "none",
    class: className = "",
  }: CardTagStripProps = $props();

  const visibleTags = $derived(maxVisible ? tags.slice(0, maxVisible) : tags);
  const hiddenCount = $derived(maxVisible ? Math.max(tags.length - maxVisible, 0) : 0);
  const shouldCollapseToHoverStack = $derived(
    compact && collapseMode === "hover-stack" && visibleTags.length > 1,
  );
  const collapsedStackTags = $derived(shouldCollapseToHoverStack ? tags : visibleTags);
  const collapsedTagCount = $derived(collapsedStackTags.length);

  function getToneClass(tone: LorcanaCardTag["tone"]): string {
    switch (tone) {
      case "info":
        return "border-sky-400/35 bg-sky-500/16 text-sky-100";
      case "success":
        return "border-emerald-400/35 bg-emerald-500/16 text-emerald-100";
      case "warning":
        return "border-amber-400/35 bg-amber-500/18 text-amber-50";
      case "danger":
        return "border-rose-400/35 bg-rose-500/18 text-rose-50";
      default:
        return "border-white/12 bg-black/35 text-white/90";
    }
  }

  function getTagAt(tagsToRender: LorcanaCardTag[], index: number): LorcanaCardTag {
    return tagsToRender[Math.min(index, tagsToRender.length - 1)]!;
  }
</script>

{#if tags.length > 0}
  {#if shouldCollapseToHoverStack}
    {@const collapsedTag = collapsedStackTags[0]}
    <div class={`pointer-events-auto flex items-center ${className}`}>
      <div class="group relative inline-flex">
        <button
          type="button"
          class={`relative inline-flex h-6 w-6 items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-150 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04] ${getToneClass(collapsedTag.tone)}`}
          aria-label={`${collapsedTagCount} tags`}
        >
          <span
            class={`absolute inset-0 rounded-full border opacity-70 transition-transform duration-150 ease-out group-hover:translate-y-[-3px] group-hover:translate-x-[3px] group-focus-within:translate-y-[-3px] group-focus-within:translate-x-[3px] ${getToneClass(getTagAt(collapsedStackTags, 1).tone)}`}
            aria-hidden="true"
          ></span>
          <span
            class={`absolute inset-0 rounded-full border opacity-55 transition-transform duration-150 ease-out group-hover:translate-y-[-6px] group-hover:translate-x-[6px] group-focus-within:translate-y-[-6px] group-focus-within:translate-x-[6px] ${getToneClass(getTagAt(collapsedStackTags, 2).tone)}`}
            aria-hidden="true"
          ></span>
          <span class="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full">
            <collapsedTag.icon class="h-3.5 w-3.5" />
          </span>
          <span class="absolute -right-1 -top-1 z-20 inline-flex min-w-3.5 items-center justify-center rounded-full border border-slate-950/80 bg-slate-100 px-1 text-[0.5rem] font-bold leading-none text-slate-900 shadow-sm">
            {collapsedTagCount}
          </span>
        </button>

        <div class="pointer-events-none absolute bottom-full left-0 z-30 mb-2 flex min-w-max translate-y-1 flex-col items-start gap-1 opacity-0 transition-all duration-150 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {#each collapsedStackTags as tag (tag.id)}
            <Tooltip.Root>
              <Tooltip.Trigger>
                {#snippet child({ props })}
                  <button
                    type="button"
                    {...props}
                    class={`inline-flex h-6 w-6 items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-150 ease-out hover:scale-105 ${getToneClass(tag.tone)}`}
                    aria-label={tag.label}
                  >
                    <tag.icon class="h-3.5 w-3.5" />
                  </button>
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content
                side="left"
                sideOffset={8}
                class="max-w-[220px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
              >
                <div class="font-semibold">{tag.label}</div>
                <div class="mt-1 text-slate-300">{tag.tooltip}</div>
              </Tooltip.Content>
            </Tooltip.Root>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class={`pointer-events-auto flex flex-wrap items-center ${compact ? "tag-strip-compact" : "gap-1.5"} ${className}`}>
      {#each visibleTags as tag (tag.id)}
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <button
                type="button"
                {...props}
                class={`group inline-flex items-center rounded-full border backdrop-blur-sm transition-colors ${compact ? "h-6 w-6 justify-center p-0 hover:z-10 hover:scale-105" : "gap-1.5 px-2 py-1 text-[0.68rem] font-semibold tracking-[0.02em]"} ${getToneClass(tag.tone)}`}
                aria-label={tag.label}
              >
                <tag.icon class={compact ? "h-3.5 w-3.5" : "h-3.5 w-3.5 shrink-0"} />
                {#if !compact}
                  <span class="leading-none">{tag.label}</span>
                {/if}
              </button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content
            side="top"
            sideOffset={compact ? 6 : 8}
            class="max-w-[220px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
          >
            <div class="font-semibold">{tag.label}</div>
            <div class="mt-1 text-slate-300">{tag.tooltip}</div>
          </Tooltip.Content>
        </Tooltip.Root>
      {/each}

      {#if hiddenCount > 0}
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <div
                {...props}
                class={`inline-flex items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/80 backdrop-blur-sm ${compact ? "h-6 min-w-6 px-1.5 text-[0.62rem] font-bold" : "px-2 py-1 text-[0.68rem] font-semibold"}`}
              >
                +{hiddenCount}
              </div>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content
            side="top"
            sideOffset={compact ? 6 : 8}
            class="max-w-[240px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
          >
            {#each tags.slice(visibleTags.length) as tag (tag.id)}
              <div>{tag.label}</div>
            {/each}
          </Tooltip.Content>
        </Tooltip.Root>
      {/if}
    </div>
  {/if}
{/if}

<style>
  .tag-strip-compact :global(> * + *) {
    margin-left: -6px;
  }
</style>
