import { audioEngine } from './AudioEngine';

export class GamepadController {
  private activeGamepadIndex: number | null = null;
  private prevButtonState: { [buttonIndex: number]: boolean } = {};
  private onAirPress: () => void;
  private onGroundPress: () => void;
  private onPausePress: () => void;

  constructor(
    onAirPress: () => void,
    onGroundPress: () => void,
    onPausePress: () => void
  ) {
    this.onAirPress = onAirPress;
    this.onGroundPress = onGroundPress;
    this.onPausePress = onPausePress;
    this.initListeners();
  }

  private initListeners(): void {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      console.log(`🎮 藍牙/有線手把已連接: ${e.gamepad.id} [Index: ${e.gamepad.index}]`);
      this.activeGamepadIndex = e.gamepad.index;
      audioEngine.triggerHapticVibration('hit');
    });

    window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
      console.log(`🎮 手把已中斷連接: ${e.gamepad.id}`);
      if (this.activeGamepadIndex === e.gamepad.index) {
        this.activeGamepadIndex = null;
      }
    });
  }

  /**
   * Poll Gamepad inputs every frame (Called inside GameLoop requestAnimationFrame)
   */
  public update(): void {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads) return;

    // Pick first connected valid gamepad
    let activeGp: Gamepad | null = null;
    if (this.activeGamepadIndex !== null && gamepads[this.activeGamepadIndex]) {
      activeGp = gamepads[this.activeGamepadIndex];
    } else {
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          activeGp = gamepads[i];
          this.activeGamepadIndex = i;
          break;
        }
      }
    }

    if (!activeGp) return;

    // Standard Gamepad Button Mapping:
    // 0: A / Cross (Ground)
    // 1: B / Circle (Ground)
    // 2: X / Square (Air)
    // 3: Y / Triangle (Air)
    // 4: LB / L1 (Air)
    // 5: RB / R1 (Ground)
    // 6: LT / L2 (Air)
    // 7: RT / R2 (Ground)
    // 8: Select / Share
    // 9: Start / Options (Pause)
    // 12: D-Pad Up (Air)
    // 13: D-Pad Down (Air)
    // 14: D-Pad Left (Air)
    // 15: D-Pad Right (Air)

    const buttons = activeGp.buttons;

    // Helper to check edge trigger (Just Pressed on this frame)
    const isJustPressed = (btnIdx: number): boolean => {
      const isPressed = buttons[btnIdx] ? buttons[btnIdx].pressed : false;
      const wasPressed = !!this.prevButtonState[btnIdx];
      this.prevButtonState[btnIdx] = isPressed;
      return isPressed && !wasPressed;
    };

    // Check AIR Inputs: D-Pad (12, 13, 14, 15), L1 (4), L2 (6), X (2), Y (3)
    const isAirJustPressed = 
      isJustPressed(12) || isJustPressed(13) || isJustPressed(14) || isJustPressed(15) ||
      isJustPressed(4) || isJustPressed(6) || isJustPressed(2) || isJustPressed(3);

    if (isAirJustPressed) {
      this.onAirPress();
    }

    // Check GROUND Inputs: A (0), B (1), R1 (5), R2 (7)
    const isGroundJustPressed = 
      isJustPressed(0) || isJustPressed(1) || isJustPressed(5) || isJustPressed(7);

    if (isGroundJustPressed) {
      this.onGroundPress();
    }

    // Check PAUSE Input: Start (9) or Select (8)
    const isPauseJustPressed = isJustPressed(9) || isJustPressed(8);
    if (isPauseJustPressed) {
      this.onPausePress();
    }
  }

  public isConnected(): boolean {
    return this.activeGamepadIndex !== null;
  }
}
