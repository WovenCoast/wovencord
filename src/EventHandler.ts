import path from "path";
import fs from "fs";
import Event from "./Event";
import WovenClient from "./Client";
import { Collection } from "discord.js";
import Utils from "./Utils";

export default class EventHandler {
  /**
   * Client responsible for this EventHandler
   */
  public client: WovenClient;
  /**
   * The cache for events that this handler holds
   */
  public cache: Collection<string, Event>;
  /**
   * The directory in which events for this handler exist
   */
  private eventDir: string;
  public eventsInvoked: number;
  public eventsSuccess: number;
  public eventsFailed: number;

  /**
   * Handler for events for the bot
   * @param client The client that this event handler belongs to
   * @param eventDir The directory of all the events of the bot
   */
  constructor(client: WovenClient, eventDir: string) {
    this.client = client;
    this.cache = new Collection();
    this.eventDir = path.join(path.dirname(require.main.filename), eventDir);
    this._readEvents();

    this.client.on("ready", () => {
      this.cache.forEach((event, eventName) => {
        this.client.on(eventName, event);
      });
    });
  }

  /**
   * Read the events from the event directory
   */
  private _readEvents() {
    const events = fs.readdirSync(this.eventDir);
    this.client.console.info(
      `Added ${Utils.pluralify(events.length, "event")}`
    );
    events.forEach(event => {
      this._addEvent(path.join(this.eventDir, event));
    });
  }

  /**
   * Add a event to cache
   * @param dir Directory of the event
   * @param category Category in which the event was found
   */
  private _addEvent(dir: string) {
    const evtRef = require(dir).default;
    const evt = new evtRef(this.client);
    this.cache.set(evt.eventName, evt);
  }

  /**
   * Refresh all the events in cache
   */
  public refreshEvents() {
    this.cache = new Collection();
    this._readEvents();
  }
}
