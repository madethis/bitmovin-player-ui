import { NavigationGroup } from './navigationgroup';
import { Component } from '../components/component';
import { UIContainer } from '../components/uicontainer';
import { Action, Direction } from './types';

/**
 * Extends NavigationGroup and provides additional logic for hiding and showing the UI on the root container.
 *
 * @category Components
 */
export class RootNavigationGroup extends NavigationGroup {
  private entered = false;

  private sendEvent(event: string) {
    window?.document?.dispatchEvent(new Event("player:" + event));
  }

  constructor(public readonly container: UIContainer, ...elements: Component<unknown>[]) {
    super(container, ...elements);

    this.onNavigation = (direction, target, preventDefault) => {
      if (!this.entered) {
        if (direction === Direction.UP) {
          this.sendEvent("next");
          return preventDefault();
        }

        if (direction === Direction.DOWN) {
          this.sendEvent("previous");
          return preventDefault();
        }

        this.entered = true;
      }
    }

    this.onAction = (action, target, preventDefault) => {
      if (action === Action.BACK) {
        this.container.hideUi();
        return preventDefault();
      }

      if (action === Action.SELECT) {
        if (this.entered) {
          const activeElement = this.getActiveElement();
          if (activeElement && activeElement.classList.contains("bmpui-ui-seekbar")) {
            this.sendEvent("playPause");
          }
        } else {
          this.entered = true;
          return preventDefault();
        }
      }

      if (action === Action.NEXT) {
        this.sendEvent("next");
        return preventDefault();
      }

      if (action === Action.PREVIOUS) {
        this.sendEvent("previous");
        return preventDefault();
      }
    }
  }

  public uiShown() {
  }

  public uiHidden() {
    this.entered = false;
  }

  public handleAction(action: Action) {
    if (!this.container.isUiShown) {
      if (action === Action.BACK) {
        this.sendEvent("exit");
        return;
      }

      this.container.showUi();
      this.focusFirstElement();
    }

    super.handleAction(action);
  }

  public handleNavigation(direction: Direction) {
    if (!this.container.isUiShown) {
      this.container.showUi();
      this.focusFirstElement();
    }

    super.handleNavigation(direction);
  }

  public release(): void {
    super.release();
  }
}
