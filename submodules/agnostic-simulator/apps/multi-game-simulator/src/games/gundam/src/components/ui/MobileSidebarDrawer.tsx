import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { DialogOverlay, DialogPortal } from "../primitives/dialog.tsx";

export interface MobileSidebarDrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly children: ReactNode;
}

export function MobileSidebarDrawer({ open, onOpenChange, children }: MobileSidebarDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-0 top-0 z-[300] h-[100dvh] w-[min(86vw,272px)] focus:outline-none data-[state=open]:[animation:gd-fade-in_.18s_ease]">
          <DialogPrimitive.Title className="sr-only">
            {m["sim.sidebar.drawer.title"]()}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {m["sim.sidebar.drawer.description"]()}
          </DialogPrimitive.Description>
          <div className="h-full overflow-hidden">{children}</div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
