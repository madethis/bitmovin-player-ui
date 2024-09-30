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
  constructor(public readonly container: UIContainer, ...elements: Component<unknown>[]) {
    super(container, ...elements);
  }

  public handleAction(action: Action) {
    if (!this.container.isUiShown) {
      this.container.showUi();
      this.focusFirstElement();
    } else {
      this.container.showUi();
      super.handleAction(action);
    }
  }

  public handleNavigation(direction: Direction) {
    if (!this.container.isUiShown) {
      this.container.showUi();
      this.focusFirstElement();
    } else {
      this.container.showUi();
      super.handleNavigation(direction);
    }
  }

  protected defaultActionHandler(action: Action): void {
    if (action === Action.BACK) {
      this.container.hideUi();
    } else {
      super.defaultActionHandler(action);
    }
  }

  public release(): void {
    super.release();
  }
}
