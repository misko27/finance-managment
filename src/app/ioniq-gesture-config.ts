import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * Trieda pre konfiguráciu dotykových gest v aplikácii
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  override buildHammer(element: HTMLElement) {
    const options = {
      touchAction: 'pan-y',
      cssProps: {
        userSelect: 'text',
      },
    };

    const mc = new (window as any).Hammer(element, options);

    // Nastavenie passive event listenerov pre dotykové udalosti
    if ((window as any).PointerEvent) {
      // Pointer events
      delete mc.defaults.inputClass.defaults.enable;
      mc.defaults.inputClass.defaults.enable = {
        touchAction: 'pan-y',
        pointerAction: 'pan-y',
      };
    }

    return mc;
  }
}
