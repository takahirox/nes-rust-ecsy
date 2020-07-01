import {System} from 'ecsy';
import {KeyInputState} from './key_input';
import {OutputBuffer, OutputContext} from './renderer';
import {WasmNes} from 'nes_rust_wasm';

class NesComponent {
  constructor() {
    this.nes = null;
  }

  reset() {
    this.nes = null;
  }
}

class NesRom {
  constructor() {
    this.content = null;
  }

  reset() {
    this.content = null;
  }
}

class NesSystem extends System {
  execute() {
    this.queries.entities.added.forEach(entity => {
      const nesComponent = entity.getMutableComponent(NesComponent);
      const rom = entity.getMutableComponent(NesRom).content;
      const outputBuffer = entity.getMutableComponent(OutputBuffer);
      const outputContext = entity.getMutableComponent(OutputContext);

      const nes = WasmNes.new();

      const width = 256;
      const height = 240;
      const canvas = outputContext.canvas;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);
      const pixels = new Uint8Array(imageData.data.buffer);

      // Set up Audio
      const setupAudio = () => {
        const audioContext = AudioContext || webkitAudioContext;

        if (audioContext === undefined) {
          throw new Error('This browser seems not to support AudioContext.');
        }

        const bufferLength = 4096;
        const context = new audioContext({sampleRate: 44100});
        const scriptProcessor = context.createScriptProcessor(bufferLength, 0, 1);

        scriptProcessor.onaudioprocess = e => {
          const data = e.outputBuffer.getChannelData(0);
          nes.update_sample_buffer(data);
        };

        scriptProcessor.connect(context.destination);
      };

      setupAudio();

      // Boot up

      nes.set_rom(rom);
      nes.bootup();

      // Update component

      nesComponent.nes = nes;
      outputBuffer.pixels = pixels;
      outputBuffer.imageData = imageData;
      outputContext.context = ctx;
    });

    this.queries.entities.results.forEach(entity => {
      const nesComponent = entity.getMutableComponent(NesComponent);
      const nes = nesComponent.nes;
      const pixels = entity.getMutableComponent(OutputBuffer).pixels;

      const inputState = entity.getMutableComponent(KeyInputState);
      inputState.keydowns.forEach(button => {
        nes.press_button(button);
      });
      inputState.keyups.forEach(button => {
        nes.release_button(button);
      });
      inputState.keydowns.length = 0;
      inputState.keyups.length = 0;

      nes.step_frame();
      nes.update_pixels(pixels);
    });
  }
}

NesSystem.queries = {
  entities: {
    components: [NesComponent, NesRom, OutputBuffer, KeyInputState],
    listen: {added: true}
  }
};

export {
  NesComponent,
  NesRom,
  NesSystem
};
