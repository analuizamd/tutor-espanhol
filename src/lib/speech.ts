/**
 * Voz do navegador (Web Speech API) para ouvir uma palavra ou frase em espanhol.
 * Usada no botão "Ouvir" das palavras e no player de prévia (enquanto o vídeo real não existe).
 */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function spanishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === "es-ES") ?? voices.find((v) => v.lang.startsWith("es"));
}

export function speak(text: string, opts: { rate?: number; onEnd?: () => void } = {}): void {
  if (!canSpeak()) {
    opts.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = opts.rate ?? 0.85;
  const voice = spanishVoice();
  if (voice) u.voice = voice;
  if (opts.onEnd) u.onend = opts.onEnd;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}
