/** Hide content outside a modal, including portals mounted after the modal opens. */
export function isolateModal(modal: HTMLElement, allowedPortalSelector?: string): () => void {
  const body = modal.ownerDocument.body;
  const states = new Map<
    HTMLElement,
    { ariaHidden: string | null; inertAttribute: string | null; inert: boolean }
  >();
  const restore = (element: HTMLElement) => {
    const state = states.get(element);
    if (!state) return;
    element.inert = state.inert;
    if (state.inertAttribute === null) element.removeAttribute("inert");
    else element.setAttribute("inert", state.inertAttribute);
    if (state.ariaHidden === null) element.removeAttribute("aria-hidden");
    else element.setAttribute("aria-hidden", state.ariaHidden);
    states.delete(element);
  };
  const isolate = () => {
    const accessible = new Set<Element>();
    const roots = [
      modal,
      ...(allowedPortalSelector ? body.querySelectorAll(allowedPortalSelector) : []),
    ];
    for (const root of roots) {
      let element: Element | null = root;
      while (element && element !== body) {
        accessible.add(element);
        element = element.parentElement;
      }
    }
    accessible.add(body);
    for (const element of accessible) {
      if (element instanceof HTMLElement) restore(element);
      // The modal and allowed portal contents stay fully accessible.
      if (roots.includes(element)) continue;
      for (const sibling of element.children) {
        if (!(sibling instanceof HTMLElement) || accessible.has(sibling)) continue;
        // A caller-owned hidden region must remain caller-owned during React cleanup.
        if (
          !states.has(sibling) &&
          sibling.hasAttribute("inert") &&
          sibling.getAttribute("aria-hidden") === "true"
        )
          continue;
        if (!states.has(sibling))
          states.set(sibling, {
            ariaHidden: sibling.getAttribute("aria-hidden"),
            inertAttribute: sibling.getAttribute("inert"),
            inert: sibling.inert,
          });
        sibling.inert = true;
        sibling.setAttribute("inert", "");
        sibling.setAttribute("aria-hidden", "true");
      }
    }
  };
  isolate();
  const observer = new MutationObserver(isolate);
  observer.observe(body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    for (const element of states.keys()) restore(element);
  };
}
