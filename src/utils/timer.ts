export class Timer {
  private startTime: number;
  private endTime: number;
  private isRunnning: boolean;

  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.isRunnning = false;
  }

  public start(): void {
    if (this.isRunnning === false) {
      this.startTime = performance.now();
      this.isRunnning = true;
    }
  }

  public stop(): void {
    if (this.isRunnning === true) {
      this.endTime = performance.now();
      this.isRunnning = false;
    }
  }

  public getTime(): number | void {
    if (this.isRunnning === false) {
      return this.endTime - this.startTime;
    }
  }

  public getFormattedTime(): string {
    const totalSeconds = Math.floor(this.endTime - this.startTime / 1000);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60); 
    const seconds = totalSeconds % 60;                  
    
    // 各単位を2桁の文字列に変換（padStartで0埋め）
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
