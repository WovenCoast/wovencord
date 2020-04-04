export default class Utils {
  /**
   * Merge options with defaults
   * @param defaults The object with default values
   * @param options The object that has values that the default object should override
   */
  static mergeDefault(defaults: Object, options: Object): any {
    return Object.assign(defaults, options);
  }

  static pluralify(amount: number, text: string): string {
    return `${amount.toString()} ${text}${amount > 1 ? "s" : ""}`;
  }
  /**
   * Make text with title case
   * @param text Text to set title case to
   */
  static titleCase(text: string): string {
    return (
      text.toLowerCase()[0].toUpperCase() +
      text.toLowerCase().slice(1, text.length)
    );
  }

  /**
   * Pick a random element from an array
   * @param array Array of elements to pick from
   * @returns A random element from the array
   */
  static getRandom(array: Array<any>): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Convert milliseconds into a human readable figure
   * @param ms The amount of milliseconds to convert
   * @returns The amount of milliseconds converted to the highest possible figure of time
   */
  static convertMs(ms: number): string {
    const showWith0 = value => (value < 10 ? `0${value}` : value);
    const days = showWith0(Math.floor((ms / (1000 * 60 * 60 * 24)) % 60));
    const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 24));
    const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
    const seconds = showWith0(Math.floor((ms / 1000) % 60));
    if (parseInt(days)) return `${days}d`;
    if (parseInt(hours)) return `${hours}h`;
    if (parseInt(minutes)) return `${minutes}min`;
    if (parseInt(seconds)) return `${seconds}s`;
    return `${ms}ms`;
  }

  /**
   * Convert bytes into a human readable figure
   * @param bytes Amount of bytes
   * @returns The amount of bytes converted to the highest possible figure of computational space
   */
  static convertBytes(bytes: number): string {
    const decimals = 2;
    if (bytes == 0) return "0 Bytes";
    var k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
