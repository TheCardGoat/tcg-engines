import { createContext, useContext, useCallback, useState } from "react";

export interface DragData {
  entityId: string;
  zoneId?: string;
  entityKind?: string;
  sourceSeatId?: string;
}

export interface DndState {
  isDragging: boolean;
  dragData: DragData | null;
  dropTargetId: string | null;
  dropTargetRole: string | null;
  isDropLegal: boolean;
}

const initialState: DndState = {
  isDragging: false,
  dragData: null,
  dropTargetId: null,
  dropTargetRole: null,
  isDropLegal: false,
};

export const DndContext = createContext<{
  state: DndState;
  startDrag: (data: DragData) => void;
  setDropTarget: (zoneId: string | null, zoneRole: string | null, isLegal: boolean) => void;
  endDrag: () => void;
}>({
  state: initialState,
  startDrag: () => {},
  setDropTarget: () => {},
  endDrag: () => {},
});

export function useDnd() {
  return useContext(DndContext);
}

export function useDndProvider() {
  const [state, setState] = useState<DndState>(initialState);

  const startDrag = useCallback((data: DragData) => {
    setState({
      isDragging: true,
      dragData: data,
      dropTargetId: null,
      dropTargetRole: null,
      isDropLegal: false,
    });
  }, []);

  const setDropTarget = useCallback(
    (dropTargetId: string | null, dropTargetRole: string | null, isDropLegal: boolean) => {
      setState((prev) => ({ ...prev, dropTargetId, dropTargetRole, isDropLegal }));
    },
    [],
  );

  const endDrag = useCallback(() => {
    setState(initialState);
  }, []);

  return { state, startDrag, setDropTarget, endDrag };
}
