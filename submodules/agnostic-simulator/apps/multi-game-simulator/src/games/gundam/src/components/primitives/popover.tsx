import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../lib/utils.ts";

/**
 * Cockpit Popover primitive.
 *
 * Wraps Radix's `@radix-ui/react-popover`. Radix supplies the positioning
 * engine (collision-aware, flips/shifts on viewport edges), portal mount,
 * outside-click dismiss, Escape key, focus return, and ARIA. We supply the
 * HUD visual shell.
 *
 * Two anchor styles are supported by Radix:
 *
 *   1. `<PopoverTrigger>` wrapping the element that opens the popover —
 *      the trigger element is the anchor automatically.
 *   2. `<PopoverAnchor virtualRef={{ current: virtualEl }}>` with a virtual
 *      element whose `getBoundingClientRect()` returns the anchor rect —
 *      useful when the caller only has coordinates, not a DOM node.
 *
 * Our CardInfoDialog uses the virtual-element path since callers hand over
 * a DOMRect when they click a card.
 */

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={10}
      className={cn(
        "z-[200] font-body text-hud-text",
        "data-[state=open]:[animation:gd-fade-in_.15s_ease]",
        "focus:outline-none",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
