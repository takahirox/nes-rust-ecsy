import {World} from 'ecsy';
import {FpsState, FpsDomElement, FpsSystem} from './fps'
import {KeyInputState, KeyInputSystem} from './key_input';
import {NesComponent, NesRom, NesSystem} from './nes';
import {OutputBuffer, OutputContext, RendererSystem} from './renderer';

const run = (romContentArray, nesCanvas, fpsSpan) => {
  const world = new World()
    .registerSystem(KeyInputSystem)
    .registerSystem(NesSystem)
    .registerSystem(RendererSystem);

  if (fpsSpan) {
    world.createEntity()
      .addComponent(FpsState)
      .addComponent(FpsDomElement, {element: fpsSpan});
    world
      .registerSystem(FpsSystem);
  }

  world.createEntity()
    .addComponent(KeyInputState)
    .addComponent(NesComponent)
    .addComponent(NesRom, {content: romContentArray})
    .addComponent(OutputBuffer)
    .addComponent(OutputContext, {canvas: nesCanvas});

  // animation frame loop
  const stepFrame = () => {
    requestAnimationFrame(stepFrame);

    // Run all the systems
    world.execute();
  };

  stepFrame();
};

export {run};
