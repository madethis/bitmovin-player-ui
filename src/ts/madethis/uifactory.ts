import { SubtitleOverlay } from '../components/subtitleoverlay';
import { SettingsPanelPage } from '../components/settingspanelpage';
import { SettingsPanelItem } from '../components/settingspanelitem';
import { SettingsPanel } from '../components/settingspanel';
import { ControlBar } from '../components/controlbar';
import { Container } from '../components/container';
import { PlaybackTimeLabel, PlaybackTimeLabelMode } from '../components/playbacktimelabel';
import { SeekBar } from '../components/seekbar';
import { SeekBarLabel } from '../components/seekbarlabel';
import { PlaybackToggleButton } from '../components/playbacktogglebutton';
import { VolumeToggleButton } from '../components/volumetogglebutton';
import { Spacer } from '../components/spacer';
import { PictureInPictureToggleButton } from '../components/pictureinpicturetogglebutton';
import { AirPlayToggleButton } from '../components/airplaytogglebutton';
import { CastToggleButton } from '../components/casttogglebutton';
import { SettingsToggleButton } from '../components/settingstogglebutton';
import { FullscreenToggleButton } from '../components/fullscreentogglebutton';
import { UIContainer } from '../components/uicontainer';
import { BufferingOverlay } from '../components/bufferingoverlay';
import { PlaybackToggleOverlay } from '../components/playbacktoggleoverlay';
import { CastStatusOverlay } from '../components/caststatusoverlay';
import { TitleBar } from '../components/titlebar';
import { ErrorMessageOverlay } from '../components/errormessageoverlay';
import { MetadataLabel, MetadataLabelContent } from '../components/metadatalabel';
import { PlayerUtils } from '../playerutils';
import { CastUIContainer } from '../components/castuicontainer';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../localization/i18n';
import { SubtitleListBox } from '../components/subtitlelistbox';
import { AudioTrackListBox } from '../components/audiotracklistbox';
import { SpatialNavigation } from '../spatialnavigation/spatialnavigation';
import { RootNavigationGroup } from '../spatialnavigation/rootnavigationgroup';
import { ListNavigationGroup, ListOrientation } from '../spatialnavigation/ListNavigationGroup';
import { QuickSeekButton } from '../components/quickseekbutton';
import { Button, ButtonConfig } from '../components/button';

declare const window: any;

class BackButton extends Button<ButtonConfig> {
  constructor(config?: ButtonConfig) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClasses: ["ui-backbutton"],
      } as ButtonConfig,
      this.config,
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // this is build around the customMessageHandler support in the react-native SDK
    // on web this will not do anything, but you could setup a function to handle this
    this.onClick.subscribe(() => {
      if(window?.bitmovin?.customMessageHandler?.sendSynchronous) {
        window.bitmovin.customMessageHandler.sendSynchronous('back');
      }

      if(window?.bitmovin?.customMessageHandler?.sendAsynchronous) {
        window.bitmovin.customMessageHandler.sendAsynchronous('backAsync');
      }
    });
  }
}

export function defaultScreen() {
  let subtitleListBox = new SubtitleListBox();
  let subtitleSettingsPanel = new SettingsPanel({
    components: [
      new SettingsPanelPage({
        components: [
          new SettingsPanelItem(null, subtitleListBox),
        ],
      }),
    ],
    hidden: true,
  });

  let audioTrackListBox = new AudioTrackListBox();
  let audioTrackSettingsPanel = new SettingsPanel({
    components: [
      new SettingsPanelPage({
        components: [
          new SettingsPanelItem(null, audioTrackListBox),
        ],
      }),
    ],
    hidden: true,
  });

  let controlBar = new ControlBar({
    components: [
      new Container({
        components: [
          new QuickSeekButton({ seekSeconds: -15 }),
          new PlaybackToggleButton(),
          new QuickSeekButton({ seekSeconds: 15 }),
        ],
        cssClasses: ['controlbar-primary'],
      }),
      new Container({
        components: [
          new Container({
            components: [
              new PlaybackTimeLabel({
                timeLabelMode: PlaybackTimeLabelMode.CurrentTime,
                hideInLivePlayback: true,
              }),
              new SeekBar({ label: new SeekBarLabel() }),
              new PlaybackTimeLabel({
                timeLabelMode: PlaybackTimeLabelMode.TotalTime,
                cssClasses: ['text-right'],
              }),
            ],
            cssClasses: ['controlbar-top'],
          }),
          new Container({
            components: [
              new VolumeToggleButton(),
              new Spacer(),
              new PictureInPictureToggleButton(),
              new AirPlayToggleButton(),
              new CastToggleButton(),
              new SettingsToggleButton({
                settingsPanel: audioTrackSettingsPanel,
                cssClass: 'ui-audiotracksettingstogglebutton',
              }),
              new SettingsToggleButton({
                settingsPanel: subtitleSettingsPanel,
                cssClass: 'ui-subtitlesettingstogglebutton',
              }),
              new FullscreenToggleButton(),
            ],
            cssClasses: ['controlbar-bottom'],
          }),
        ],
        cssClasses: ['controlbar-secondary'],
      }),
      audioTrackSettingsPanel,
      subtitleSettingsPanel,
    ], cssClass: 'ui-controlbar',
  });

  return new UIContainer({
    components: [
      new SubtitleOverlay(),
      new BufferingOverlay(),
      new CastStatusOverlay(),
      controlBar,
      new TitleBar({
        components: [
          new BackButton(),
          new MetadataLabel({ content: MetadataLabelContent.Title }),
          new MetadataLabel({ content: MetadataLabelContent.Description }),
        ], cssClass: 'ui-titlebar',
      }),
      new ErrorMessageOverlay(),
    ],
    cssClasses: ['ui-skin-web', 'ui-skin-mobile'],
    hideDelay: 2000,
    hidePlayerStateExceptions: [
      PlayerUtils.PlayerState.Prepared,
      PlayerUtils.PlayerState.Paused,
      PlayerUtils.PlayerState.Finished,
    ],
  });
}

export function tvScreen() {
    const subtitleListBox = new SubtitleListBox();
    const subtitleListPanel = new SettingsPanel({
      components: [
        new SettingsPanelPage({
          components: [new SettingsPanelItem(null, subtitleListBox)],
        }),
      ],
      hidden: true,
    });

    const audioTrackListBox = new AudioTrackListBox();
    const audioTrackListPanel = new SettingsPanel({
      components: [
        new SettingsPanelPage({
          components: [new SettingsPanelItem(null, audioTrackListBox)],
        }),
      ],
      hidden: true,
    });

    const quickSeekBackButton = new QuickSeekButton({ seekSeconds: -15 });
    const quickSeekForwardButton = new QuickSeekButton({ seekSeconds: 15 });
    const playbackToggleButton = new PlaybackToggleButton();
    const seekBar = new SeekBar({ label: new SeekBarLabel() });
   
    const subtitleToggleButton = new SettingsToggleButton({
      settingsPanel: subtitleListPanel,
      autoHideWhenNoActiveSettings: true,
      cssClass: 'ui-subtitlesettingstogglebutton',
      text: i18n.getLocalizer('settings.subtitles'),
    });

    const audioToggleButton = new SettingsToggleButton({
      settingsPanel: audioTrackListPanel,
      autoHideWhenNoActiveSettings: true,
      cssClass: 'ui-audiotracksettingstogglebutton',
      ariaLabel: i18n.getLocalizer('settings.audio.track'),
      text: i18n.getLocalizer('settings.audio.track'),
    });

    const playbackControls = new Container({
      components: [
        quickSeekBackButton,
        playbackToggleButton,
        quickSeekForwardButton,
      ], cssClasses: ['ui-controls-playback']
    })

    const settingsControls = new Container({
      components: [
        subtitleToggleButton,
        audioToggleButton,
      ], cssClasses: ['ui-controls-settings']
    })

    const uiContainer = new UIContainer({
      components: [
        new SubtitleOverlay(),
        new BufferingOverlay(),
        new ControlBar({
          components: [
            new Container({
              components: [
                new Container({
                  components: [
                    new PlaybackTimeLabel({
                      timeLabelMode: PlaybackTimeLabelMode.CurrentTime,
                      hideInLivePlayback: true,
                    }),
                    new PlaybackTimeLabel({
                      timeLabelMode: PlaybackTimeLabelMode.RemainingTime,
                      cssClasses: ['text-right'],
                    })
                  ],
                  cssClasses: ['controlbar-time-labels']
                }),
                seekBar,
              ],
              cssClasses: ['controlbar-secondary'],
            }),
            new Container({
              components: [
                playbackControls,
                settingsControls,
              ],
              cssClasses: ['controlbar-primary'],
            }),
            new Container({
              components: [
                subtitleListPanel,
                audioTrackListPanel,
              ],
              cssClasses: ['controlbar-lists'],
            }),
          ], cssClass: 'ui-controlbar',
        }),
        new TitleBar({
          components: [
            new MetadataLabel({ content: MetadataLabelContent.Title }),
            new MetadataLabel({ content: MetadataLabelContent.Description }),
          ],
        }),
        new ErrorMessageOverlay(),
      ],
      cssClasses: ['ui-skin-tv'],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });

    const spatialNavigation = new SpatialNavigation(
      new RootNavigationGroup(
        uiContainer,
        playbackToggleButton,
        quickSeekBackButton,
        quickSeekForwardButton,
        audioToggleButton,
        subtitleToggleButton,
        seekBar,
      ),
      new ListNavigationGroup(ListOrientation.Vertical, subtitleListPanel, subtitleListBox),
      new ListNavigationGroup(ListOrientation.Vertical, audioTrackListPanel, audioTrackListBox),
    );

  return [
    {
      ui: uiContainer,
      spatialNavigation,
    }
  ]
}

export function castScreen() {
  let controlBar = new ControlBar({
    components: [
      new Container({
        components: [
          new PlaybackTimeLabel({
            timeLabelMode: PlaybackTimeLabelMode.CurrentTime,
            hideInLivePlayback: true,
          }),
          new SeekBar({ smoothPlaybackPositionUpdateIntervalMs: -1 }),
          new PlaybackTimeLabel({
            timeLabelMode: PlaybackTimeLabelMode.TotalTime,
            cssClasses: ['text-right'],
          }),
        ],
        cssClasses: ['controlbar-top'],
      }),
    ],
  });

  return new CastUIContainer({
    components: [
      new SubtitleOverlay(),
      new BufferingOverlay(),
      new PlaybackToggleOverlay(),
      controlBar,
      new TitleBar({ keepHiddenWithoutMetadata: true }),
      new ErrorMessageOverlay(),
    ],
    cssClasses: ['ui-skin-cast-receiver'],
    hideDelay: 2000,
    hidePlayerStateExceptions: [
      PlayerUtils.PlayerState.Prepared,
      PlayerUtils.PlayerState.Paused,
      PlayerUtils.PlayerState.Finished,
    ],
  });
}
