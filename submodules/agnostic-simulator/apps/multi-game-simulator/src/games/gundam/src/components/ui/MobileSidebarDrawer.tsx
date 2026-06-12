import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { DialogOverlay, DialogPortal } from "../primitives/dialog.tsx";

export interface MobileSidebarDrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly children: ReactNode;
}

/**
 * Slide-from-left sheet used on mobile to surface the full MatchSidebar
 * (header, player cards, match meta, event log, footer actions). Radix
 * Dialog handles focus trap / ESC / scrim.
 */
export function MobileSidebarDrawer({ open, onOpenChange, children }: MobileSidebarDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed left-0 top-0 z-[300] w-[min(86vw,272px)] h-[100dvh] focus:outline-none
            data-[state=open]:[animation:gd-fade-in_.18s_ease]"
        >
          <DialogPrimitive.Title className="sr-only">Match sidebar</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Match information, event log, and match actions.
          </DialogPrimitive.Description>
          <div className="h-full overflow-hidden">{children}</div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
