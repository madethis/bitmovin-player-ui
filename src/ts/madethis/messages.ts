declare const window: any;

export function sendCustomMessage(message: string) {
  if(window?.bitmovin?.customMessageHandler?.sendSynchronous) {
    window.bitmovin.customMessageHandler.sendSynchronous(message);
  }

  if(window?.bitmovin?.customMessageHandler?.sendAsynchronous) {
    window.bitmovin.customMessageHandler.sendAsynchronous(message + 'Async');
  }
}

export function onCustomMessage(message: string, callback: (data?: string) => void) {
  if(window?.bitmovin?.customMessageHandler?.on) {
    window.bitmovin.customMessageHandler.on(message, callback);
  }
}
