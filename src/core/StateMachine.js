export const STATES = {
  IDLE: "IDLE",
  JUMPING: "JUMPING",
  SWITCHING_THEME: "SWITCHING_THEME",
};

export class StateMachine {
  constructor() {
    this.state = STATES.IDLE;
  }

  canTransition(target) {
    return this.state === STATES.IDLE && target !== STATES.IDLE;
  }

  async transition(target, runner) {
    if (!this.canTransition(target)) {
      return false;
    }

    this.state = target;
    try {
      await runner();
    } finally {
      this.state = STATES.IDLE;
    }

    return true;
  }

  isBusy() {
    return this.state !== STATES.IDLE;
  }
}
