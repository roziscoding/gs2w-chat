GS2W Chat
=========

> Simple, socket.io based chat with a terminal client

## Running

You can download prebuilt binaries from the releases page.

If you want to run this from the source, follow these instructions:

### Server
- `git clone` this
- `cd gsw2-chat/server`
- `npm install`
- `npm start -u USERNAME -p PASSWORD -o PORT`

### Client
- `git clone` this
- `cd gsw2-chat/app`
- `npm install`
- `npm start -n YOUR_NICKNAME -s SERVER_ADDRESS -c SERVER_USERNAME:SERVER_PASSWORD`

## Options

Both the client and the server support options that can be passed either through environment variables or command line arguments. Here they ar:

### Server

- #### Username
    - Description: Username the clients will have to inform in order to connect to the server
    - Variable: `GS2W_USER`
    - Argument: `--username` or `-u`

- #### Password
    - Description: Password the clients will have to inform in order to connect to the server
    - Variable: `GS2W_PASS`
    - Argument: `--password` or `-p`

- #### Port
    - Description: Port the server will listen on
    - Variable: `GS2W_PORT`
    - Argument: `--port` or `-o`

### Client

- #### Credentials
    - Description: Username and password required by the server to connect. (The expected format is `username:passowrd`)
    - Variable: `GS2W_CREDENTIALS`
    - Argument: `--credentials` or `-c`

- #### Nickname
    - Description: Nickname you want to use to identify you on the server
    - Variable: `GS2W_NICKNAME
    - Argument: `--nickname` or `-n`

- #### Server
    - Description: Server URL (and port)
    - Variable: `GS2W_SERVER`
    - Argument: `--server` or `-s`

## Building

In order to build this, you'll need [pnpm](http://npmjs.org/package/pnpm), so go get it first.

After you have `pnpm`, do this:

- `git clone` this
- `cd gsw2-chat/app` or `cd gsw2-chat/server`
- npm run build

You'll find the binaries on the `dist` folder.

By default, the `build` script will create binaries for windows, MacOS an Linux. If you don't want them all, you can use the OS-specific build commands `build:windows`, `build:macos` or `build:linux`

---

**Enjoy! :D**