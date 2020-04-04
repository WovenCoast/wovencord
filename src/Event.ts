import WovenClient from "./Client";

interface EventOptions {
  name: string;
  eventName: string;
}
export default abstract class Event {
  /**
   * The client associated with this event
   */
  public client: WovenClient;
  /**
   * The options for this event
   */
  public options: EventOptions;
  [key: string]: any;

  /**
   * An event
   * @param client The client associated with this event
   * @param options The options for this event
   */
  constructor(client, options) {
    this.client = client;
    this.options = options;
  }

  abstract async exec(...args: any[]): Promise<void>;
}
