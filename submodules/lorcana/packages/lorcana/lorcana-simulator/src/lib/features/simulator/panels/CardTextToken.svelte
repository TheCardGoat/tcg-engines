<script lang="ts">
  interface CardTokenData {
    inkType?: string[];
    label: string;
  }

  interface CardTextTokenProps {
    card: CardTokenData;
    text?: string;
    interactive?: boolean;
    onHover?: () => void;
    onLeave?: () => void;
  }

  let {
    card,
    text = card.label,
    interactive = true,
    onHover = () => {},
    onLeave = () => {},
  }: CardTextTokenProps = $props();

  function cardTokenClasses(card: CardTokenData): string {
    const ink = card.inkType?.[0]?.toLowerCase() ?? "";
    switch (ink) {
      case "amber":
        return "text-amber-300";
      case "amethyst":
        return "text-fuchsia-300";
      case "emerald":
        return "text-emerald-300";
      case "ruby":
        return "text-rose-300";
      case "sapphire":
        return "text-sky-300";
      case "steel":
        return "text-slate-200";
      default:
        return "text-slate-300";
    }
  }
</script>

{#if interactive}
  <span
    class={`inline cursor-pointer border-0 bg-transparent p-0 font-bold underline underline-offset-2 decoration-1 align-baseline leading-[inherit] transition hover:opacity-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current ${cardTokenClasses(card)}`}
    onmouseenter={onHover}
    onmouseleave={onLeave}
    onfocus={onHover}
    onblur={onLeave}
    role="log"
  >
    {text}
  </span>
{:else}
  <span
    role="presentation"
    class={`inline font-bold underline underline-offset-2 decoration-1 align-baseline leading-[inherit] ${cardTokenClasses(card)}`}
    onmouseenter={onHover}
    onmouseleave={onLeave}
  >
    {text}
  </span>
{/if}
