import axios, { type AxiosInstance } from "axios";
import { Socket } from "./socket";
import RoomManager from "./room";
import MessageManager from "./message";
import { version } from "./consts";
import UserManager, { PrivateUser } from "./user";
import ClanManager from "./clan";
import DataManager from "./data";
export * from "./helpers";
export * from "./consts";
export * from "./socket";
export * from "./room";
export * from "./message";
export * from "./user";
export * from "./clan";
export * from "./data/"
export * from "./data.types";
export { UserManager, RoomManager, MessageManager, ClanManager, DataManager };


export interface ClientOptions {
    /**
     * The token of the user to login with.
     */
    token: string;
    /**
     * If the client should automatically reconnect when disconnected.
     * @default false
     */
    reconnect?: boolean;
    /**
     * The amount of time to wait before reconnecting in milliseconds.
     * @default 2000
     */
    reconnectTime?: number;
    /**
     * The amount of times to try to reconnect before giving up.
     * @default Infinity
     */
    reconnectAttempts?: number;
}

export class Client {
    public readonly token: string;
    public readonly roomManager: RoomManager;
    public readonly messageManager: MessageManager;
    public readonly clanManager: ClanManager;
    public readonly dataManager: DataManager;
    public readonly userManager: UserManager;
    public readonly socket: Socket;
    public readonly axiosInstace: AxiosInstance;
    public user: PrivateUser;
    public config: Omit<ClientOptions, "token">;

    constructor(options: ClientOptions) {
        this.token = options.token;
        this.config = {
            reconnect: options.reconnect ?? false,
            reconnectTime: options.reconnectTime ?? 2000,
            reconnectAttempts: options.reconnectAttempts ?? Infinity
        };
        this.messageManager = new MessageManager(this);
        this.socket = new Socket(this);
        this.axiosInstace = axios.create({
            baseURL: "https://blacket.org/",
            headers: {
                cookie: `token=${this.token};`,
                "User-Agent": `blacket.js (${version}}`
            },
            validateStatus: () => true
        });

        this.userManager = new UserManager(this);
        this.roomManager = new RoomManager(this);
        this.clanManager = new ClanManager(this);
        this.dataManager = new DataManager(this);
    }
}