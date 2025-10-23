// A simple sound utility to play audio effects.

// A cache of Audio objects
const audioCache: { [key: string]: HTMLAudioElement } = {};

// A map of sound names to their audio file URLs.
// Sounds from: https://www.zapsplat.com/sound-effect-category/button-clicks/
const sounds = {
  click: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_button_click_fast_short_001_83261.mp3",
  add: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_button_click_fast_short_002_83262.mp3",
  delete: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_button_click_soft_001_83265.mp3",
  complete: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_game_sound_positive_action_generic_001_83220.mp3",
  incomplete: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_game_sound_error_001_83227.mp3",
  navigate: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_button_click_short_generic_001_83257.mp3",
  open: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-zapsplat/zapsplat_multimedia_button_click_short_bright_001_83259.mp3",
};

export type SoundType = keyof typeof sounds;

/**
 * Plays a sound effect.
 * @param sound - The name of the sound to play.
 */
export function playSound(sound: SoundType) {
  if (typeof window === "undefined") return;

  let audio = audioCache[sound];
  
  if (!audio) {
    audio = new Audio(sounds[sound]);
    audioCache[sound] = audio;
  }
  
  // Rewind to the start if it's already playing
  audio.currentTime = 0;
  
  // Play the sound
  audio.play().catch(error => {
    // Autoplay is often restricted by browsers.
    // We can ignore this error as it's not critical.
    console.warn(`Could not play sound: ${sound}`, error);
  });
}
