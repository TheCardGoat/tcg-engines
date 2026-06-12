<script lang="ts">
  import type { LorcanaFormatId } from "@tcg/lorcana-types";

  interface Props {
    formats?: LorcanaFormatId[];
    class?: string;
  }

  let { formats = [], class: className = "" }: Props = $props();

  const FORMAT_META: Record<LorcanaFormatId, { label: string; title: string; style: string }> = {
    infinity: {
      label: "Infinity",
      title: "Infinity — All sets legal",
      style: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    },
    "core-constructed": {
      label: "Core",
      title: "Core Constructed — Current rotating format",
      style: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    },
    "archazias-island": {
      label: "Archazia's",
      title: "Archazia's Island — Sets SSK–FAB",
      style: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    },
    "shimmering-skies": {
      label: "Shimm. Skies",
      title: "Shimmering Skies — Sets TFC–SSK",
      style: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    },
    "azurite-sea": {
      label: "Azurite Sea",
      title: "Azurite Sea — Sets TFC–AZS",
      style: "bg-teal-400/15 text-teal-300 border-teal-400/30",
    },
  };
</script>

{#if formats.length > 0}
  <div class="flex flex-wrap gap-1 {className}">
    {#each formats as formatId}
      {@const meta = FORMAT_META[formatId]}
      {#if meta}
        <span
          title={meta.title}
          class="inline-flex items-center rounded border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide leading-none {meta.style}"
        >
          {meta.label}
        </span>
      {/if}
    {/each}
  </div>
{/if}
