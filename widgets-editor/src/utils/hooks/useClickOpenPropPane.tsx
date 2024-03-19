import { useShowPropertyPane } from "utils/hooks/dragResizeHooks";
import { selectWidget } from "actions/widgetActions";
import {
  getCurrentWidgetId,
  getIsPropertyPaneVisible,
} from "selectors/propertyPaneSelectors";
import { useSelector } from "store";
import { AppState } from "reducers";
import { APP_MODE } from "reducers/entityReducers/appReducer";
import { getAppMode } from "selectors/applicationSelectors";
import { useCallback } from "react";
import { useStore } from "react-redux";

export const useClickOpenPropPane = () => {
  const showPropertyPane = useShowPropertyPane();
  const isPropPaneVisible = useSelector(getIsPropertyPaneVisible);
  // const selectedWidgetId = useSelector(getCurrentWidgetId);
  // hook number 20:
  // const focusedWidget = useSelector(
  //   (state: AppState) => state.ui.widgetDragResize.focusedWidget,
  // );
  const store = useStore();
  // const isCurrentWidgetFocused = useSelector(
  //   (state: AppState) =>
  //     state.ui.widgetDragResize.focusedWidget === getCurrentWidgetId(state),
  // );
  // This state tells us whether a `ResizableComponent` is resizing
  const isResizing = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isResizing,
  );
  const appMode = useSelector(getAppMode);

  // This state tells us whether a `DraggableComponent` is dragging
  const isDragging = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDragging,
  );
  const openPropertyPane = useCallback(() => {
    // ignore click captures if the component was resizing or dragging coz it is handled internally in draggable component
    if (isResizing || isDragging || appMode !== APP_MODE.EDIT) return;
    const state = store.getState() as AppState;
    const isCurrentWidgetFocused =
      state.ui.widgetDragResize.focusedWidget === getCurrentWidgetId(state);
    if (
      (!isPropPaneVisible && isCurrentWidgetFocused) ||
      !isCurrentWidgetFocused
    ) {
      selectWidget(state.ui.widgetDragResize.focusedWidget);
      showPropertyPane(
        state.ui.widgetDragResize.focusedWidget,
        undefined,
        true,
      );
    }
  }, [
    appMode,
    isDragging,
    isPropPaneVisible,
    isResizing,
    selectWidget,
    showPropertyPane,
  ]);
  return openPropertyPane;
};
