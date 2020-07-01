import {System} from 'ecsy';

class OutputBuffer {
  constructor() {
    this.pixels = null;
    this.imageData = null;
  }

  reset() {
    this.pixels = null;
    this.imageData = null;
  }
}

class OutputContext {
  constructor() {
    this.canvas = null;
    this.context = null;
  }

  reset() {
    this.canvas = null;
    this.context = null;
  }
}

class RendererSystem extends System {
  execute() {
    this.queries.entities.results.forEach(entity => {
      const context = entity.getMutableComponent(OutputContext);
      const buffer = entity.getComponent(OutputBuffer);
      context.context.putImageData(buffer.imageData, 0, 0);
    });
  }
}

RendererSystem.queries = {
  entities: {components: [OutputBuffer, OutputContext]}
};

export {
  OutputBuffer,
  OutputContext,
  RendererSystem
};
