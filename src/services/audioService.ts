class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playCorrect() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.1); // C6
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.4);
  }

  public playWrong() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.2);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(100, t + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playStep() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playTick(isUrgent = false) {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isUrgent ? 880 : 520;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(isUrgent ? 0.18 : 0.08, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  public playSummit() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const playNote = (freq: number, start: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + duration);
    };

    playNote(523.25, t, 0.3);
    playNote(659.25, t + 0.3, 0.3);
    playNote(783.99, t + 0.6, 0.3);
    playNote(1046.50, t + 0.9, 0.6);
  }

  public playTransition() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(2000, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.25);
    gain.gain.linearRampToValueAtTime(0, t + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start(t);
  }

  public playComplete() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const playNote = (freq: number, start: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + duration);
    };

    const seq = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    seq.forEach((freq, i) => {
       playNote(freq, t + i * 0.2, 0.4);
    });
    playNote(523.25, t + seq.length * 0.2, 1.5);
    playNote(659.25, t + seq.length * 0.2, 1.5);
    playNote(1046.50, t + seq.length * 0.2, 1.5);
  }
}

export const audioService = new AudioService();
