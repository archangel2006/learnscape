
/**
 * Utility for browser-based text-to-speech narration.
 */

/**
 * Stops any current speech synthesis narration.
 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Narrates the provided text using the browser's speech synthesis.
 * Cancels any ongoing narration before starting.
 * @param text The string to be spoken.
 */
export function speak(text: string) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    stopSpeaking();
    
    // Ensure speech synthesis is available and configured
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: refine voice selection here if needed
    // const voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices.find(v => v.lang.startsWith('en')) || null;
    
    window.speechSynthesis.speak(utterance);
  }
}
