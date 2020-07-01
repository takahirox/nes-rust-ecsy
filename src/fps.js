import {System} from 'ecsy';

class FpsState {
  constructor() {
    this.frameCount = 0;
    this.totalElapsedTime = 0.0;
  }

  reset() {
    this.frameCount = 0;
    this.totalElapsedTime = 0.0;
  }
}

class FpsDomElement {
  constructor() {
    this.element = null;
  }

  reset() {
    this.element = null;
  }
}

class FpsSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      const state = entity.getMutableComponent(FpsState);
      state.frameCount += 1;
      state.totalElapsedTime += delta;
      if ((state.frameCount % 60) === 0) {
        const element = entity.getMutableComponent(FpsDomElement).element;
        element.textContent = (1000.0 / (state.totalElapsedTime / 60)).toFixed(2);
        state.totalElapsedTime = 0.0;
        state.frameCount = 0;
      }
    });
  }
}

FpsSystem.queries = {
  entities: {components: [FpsState, FpsDomElement]}
};

export {FpsState, FpsDomElement, FpsSystem};
