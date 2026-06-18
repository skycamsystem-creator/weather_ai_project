# backend/modes/mode_manager.py

class ModeState:
    """
    Holds the current mode flags.
    """
    def __init__(self):
        self.normal = True
        self.storm = False
        self.boost = False
        self.max = False
        self.clear_air = False


class ModeManager:
    """
    Controls system modes:
    - Normal Mode (default)
    - Storm Mode (auto)
    - Boost Mode (manual)
    - Max Mode (manual)
    - Clear Air Mode (auto)
    """

    def __init__(self):
        self.state = ModeState()

    # ---------------------------------------------------------
    # AUTO MODES
    # ---------------------------------------------------------
    def apply_clear_air(self, is_clear: bool):
        """
        Activates Clear Air Mode when radar VCP indicates no precip.
        """
        if is_clear:
            self.state.clear_air = True
            self.state.storm = False
            self.state.boost = False
            self.state.max = False
        else:
            self.state.clear_air = False

    def apply_storm_detection(self, storm_present: bool):
        """
        Activates Storm Mode when radar VCP indicates precip.
        """
        if storm_present and not self.state.clear_air:
            self.state.storm = True
        else:
            self.state.storm = False

    # ---------------------------------------------------------
    # MANUAL MODES
    # ---------------------------------------------------------
    def toggle_boost(self):
        """
        Boost Mode = 3 ensemble passes.
        Cannot be enabled in Clear Air Mode.
        """
        if self.state.clear_air:
            return self.state

        self.state.boost = not self.state.boost

        if self.state.boost:
            self.state.max = False

        return self.state

    def toggle_max(self):
        """
        Max Mode = 8 ensemble passes + temporal fusion.
        Cannot be enabled in Clear Air Mode.
        """
        if self.state.clear_air:
            return self.state

        self.state.max = not self.state.max

        if self.state.max:
            self.state.boost = False

        return self.state
