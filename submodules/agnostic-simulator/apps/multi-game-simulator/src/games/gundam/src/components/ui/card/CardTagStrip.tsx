import * as HoverCard from "@radix-ui/react-hover-card";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

import { cn } from "../../../lib/utils.ts";
import type { CardTag } from "./card-tags.ts";
import { TAG_TONE_CLASSES } from "./card-tags.ts";

export interface CardTagStripProps {
  readonly tags: readonly CardTag[];
  readonly maxVisible?: number;
  readonly compact?: boolean;
  readonly collapseMode?: "none" | "hover-stack";
  readonly className?: string;
}

export function CardTagStrip({
  tags,
  maxVisible,
  compact = false,
  collapseMode = "none",
  className = "",
}: CardTagStripProps) {
  if (tags.length === 0) return null;

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible ? Math.max(tags.length - maxVisible, 0) : 0;
  const shouldCollapseToHoverStack =
    compact && collapseMode === "hover-stack" && visibleTags.length > 1;
  const collapsedStackTags = shouldCollapseToHoverStack ? tags : visibleTags;
  const collapsedTagCount = collapsedStackTags.length;

  if (shouldCollapseToHoverStack) {
    const collapsedTag = collapsedStackTags[0]!;
    const CollapsedIcon = collapsedTag.icon;
    const secondTone = getTagAt(collapsedStackTags, 1).tone;
    const thirdTone = getTagAt(collapsedStackTags, 2).tone;

    return (
      <div className={cn("pointer-events-auto flex items-center", className)}>
        <div className="group relative inline-flex">
          <TagTooltip tag={collapsedTag} side="top" sideOffset={8}>
            <button
              type="button"
              className={cn(
                "relative inline-flex h-6 w-6 items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-150 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04]",
                TAG_TONE_CLASSES[collapsedTag.tone],
              )}
              aria-label={`${collapsedTagCount} tags`}
              title={`${collapsedTag.label} — ${collapsedTag.tooltip}`}
              onClick={(event) => event.stopPropagation()}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full border opacity-70 transition-transform duration-150 ease-out group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-focus-within:translate-x-[3px] group-focus-within:translate-y-[-3px]",
                  TAG_TONE_CLASSES[secondTone],
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "absolute inset-0 rounded-full border opacity-55 transition-transform duration-150 ease-out group-hover:translate-x-[6px] group-hover:translate-y-[-6px] group-focus-within:translate-x-[6px] group-focus-within:translate-y-[-6px]",
                  TAG_TONE_CLASSES[thirdTone],
                )}
                aria-hidden="true"
              />
              <span className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full">
                <CollapsedIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="absolute -right-1 -top-1 z-20 inline-flex min-w-3.5 items-center justify-center rounded-full border border-slate-950/80 bg-slate-100 px-1 text-[0.5rem] font-bold leading-none text-slate-900 shadow-sm">
                {collapsedTagCount}
              </span>
            </button>
          </TagTooltip>

          <div className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 flex min-w-max translate-y-1 flex-col items-start gap-1 opacity-0 transition-all duration-150 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {collapsedStackTags.map((tag) => (
              <TagTooltip key={tag.id} tag={tag} side="left" sideOffset={8}>
                <TagButton tag={tag} compact />
              </TagTooltip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-auto flex flex-wrap items-center",
        compact ? "tag-strip-compact" : "gap-1.5",
        className,
      )}
    >
      {visibleTags.map((tag) => (
        <TagTooltip key={tag.id} tag={tag} side="top" sideOffset={compact ? 6 : 8}>
          <TagButton tag={tag} compact={compact} />
        </TagTooltip>
      ))}

      {hiddenCount > 0 && (
        <HoverCard.Root openDelay={150} closeDelay={80}>
          <HoverCard.Trigger asChild>
            <div
              className={cn(
                "inline-flex items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/80 backdrop-blur-sm",
                compact
                  ? "h-6 min-w-6 px-1.5 text-[0.62rem] font-bold"
                  : "px-2 py-1 text-[0.68rem] font-semibold",
              )}
              onClick={(event) => event.stopPropagation()}
            >
              +{hiddenCount}
            </div>
          </HoverCard.Trigger>
          <TooltipContent side="top" sideOffset={compact ? 6 : 8} className="max-w-[240px]">
            {tags.slice(visibleTags.length).map((tag) => (
              <div key={tag.id}>{tag.label}</div>
            ))}
          </TooltipContent>
        </HoverCard.Root>
      )}
    </div>
  );
}

function getTagAt(tagsToRender: readonly CardTag[], index: number): CardTag {
  return tagsToRender[Math.min(index, tagsToRender.length - 1)]!;
}

interface TagTooltipProps {
  readonly tag: CardTag;
  readonly side: ComponentPropsWithoutRef<typeof HoverCard.Content>["side"];
  readonly sideOffset: number;
  readonly children: ReactElement;
}

function TagTooltip({ tag, side, sideOffset, children }: TagTooltipProps) {
  const inlinePosition =
    side === "left"
      ? "right-full top-1/2 mr-2 -translate-y-1/2"
      : "bottom-full left-1/2 mb-2 -translate-x-1/2";

  return (
    <HoverCard.Root openDelay={150} closeDelay={80}>
      <span className="group/tag-tooltip relative inline-flex">
        <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
        <span
          className={cn(
            "pointer-events-none absolute z-[9999] hidden w-max max-w-[220px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 opacity-0 shadow-xl transition-opacity duration-150 group-hover/tag-tooltip:block group-hover/tag-tooltip:opacity-100 group-focus-within/tag-tooltip:block group-focus-within/tag-tooltip:opacity-100",
            inlinePosition,
          )}
          style={{ marginBlockEnd: side === "top" ? sideOffset : undefined }}
          role="tooltip"
        >
          <span className="block font-semibold">{tag.label}</span>
          <span className="mt-1 block text-slate-300">{tag.tooltip}</span>
        </span>
      </span>
      <TooltipContent side={side} sideOffset={sideOffset}>
        <div className="font-semibold">{tag.label}</div>
        <div className="mt-1 text-slate-300">{tag.tooltip}</div>
      </TooltipContent>
    </HoverCard.Root>
  );
}

interface TagButtonProps {
  readonly tag: CardTag;
  readonly compact: boolean;
}

function TagButton({ tag, compact }: TagButtonProps) {
  const Icon = tag.icon;
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex items-center rounded-full border backdrop-blur-sm transition-colors",
        compact
          ? "h-6 w-6 justify-center p-0 hover:z-10 hover:scale-105"
          : "gap-1.5 px-2 py-1 text-[0.68rem] font-semibold tracking-[0.02em]",
        TAG_TONE_CLASSES[tag.tone],
      )}
      aria-label={tag.label}
      title={`${tag.label} — ${tag.tooltip}`}
      onClick={(event) => event.stopPropagation()}
    >
      <Icon className={compact ? "h-3.5 w-3.5" : "h-3.5 w-3.5 shrink-0"} aria-hidden="true" />
      {!compact && <span className="leading-none">{tag.label}</span>}
    </button>
  );
}

function TooltipContent({
  side,
  sideOffset,
  className,
  children,
}: ComponentPropsWithoutRef<typeof HoverCard.Content>) {
  return (
    <HoverCard.Portal>
      <HoverCard.Content
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-[220px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 shadow-xl",
          className,
        )}
      >
        {children}
      </HoverCard.Content>
    </HoverCard.Portal>
  );
}
