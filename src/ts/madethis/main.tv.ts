import { PlayerAPI } from 'bitmovin-player';
import { UIConfig } from '../uiconfig';
import { UIManager } from '../uimanager';
import { castScreen, tvScreen } from './uifactory'

export * from '../main'

export namespace UIFactory {
  export function buildDefaultUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return new UIManager(player, tvScreen(), config);
  }

  export function buildDefaultSmallScreenUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return buildDefaultUI(player, config);
  }

  export function buildDefaultCastReceiverUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return new UIManager(player, castScreen(), config);
  }

  export function buildDefaultTvUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return new UIManager(player, tvScreen(), config);
  }
}
