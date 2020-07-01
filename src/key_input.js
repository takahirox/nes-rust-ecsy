import {System} from 'ecsy';
import {Button} from 'nes_rust_wasm';

class KeyInputState {
  constructor() {
    this.keydowns = [];
    this.keyups = [];
  }

  reset() {
    this.keydowns.length = 0;
    this.keyups.length = 0;
  }
}

class KeyInputSystem extends System {
  execute() {
    this.queries.entities.added.forEach(entity => {
      const state = entity.getMutableComponent(KeyInputState);

      // @TODO: Mapping should be configurable
      const getButton = keyCode => {
        switch (keyCode) {
          case 32: // space
            return Button.Start;
          case 37: // Left
            return Button.Joypad1Left;
          case 38: // Up
            return Button.Joypad1Up;
          case 39: // Right
            return Button.Joypad1Right;
          case 40: // Down
            return Button.Joypad1Down;
          case 50: // 2
            return Button.Joypad2Down;
          case 52: // 4
            return Button.Joypad2Left;
          case 54: // 6
            return Button.Joypad2Right;
          case 56: // 8
            return Button.Joypad2Up;
          case 65: // A
            return Button.Joypad1A;
          case 66: // B
            return Button.Joypad1B;
          case 82: // R
            return Button.Reset;
          case 83: // S
            return Button.Select;
          case 88: // X
            return Button.Joypad2A;
          case 90: // Z
            return Button.Joypad2B;
          default:
            return null; 
        }
      };

      window.addEventListener('keydown', event => {
        const button = getButton(event.keyCode);
        if (button === null) {
          return;
        }
        if (!state.keydowns.includes(button)) {
          state.keydowns.push(button);
        }
        event.preventDefault();
      }, false);

      window.addEventListener('keyup', event => {
        const button = getButton(event.keyCode);
        if (button === null) {
          return;
        }
        if (!state.keyups.includes(button)) {
          state.keyups.push(button);
        }
        event.preventDefault();
      }, false);
    });
  }
}

KeyInputSystem.queries = {
  entities: {
    components: [KeyInputState],
    listen: {added: true}
  }
};

export {
  KeyInputState,
  KeyInputSystem
};
