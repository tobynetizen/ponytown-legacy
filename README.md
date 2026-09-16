# Pony Town Legacy
A forked version of the outdated Pony Town custom server source with updated build instructions.

## Prerequisites
- NodeJS (v9.11.2)
- Gulp (v4.0.2)
- MongoDB (v7.0.43)
- ImageMagick (v7.0.8-63) — Optional, only used for generating preview GIFs in the animation tool.

## NodeJS Setup
Install NVM:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Install NodeJS:
```bash
nvm install 9.11.2
nvm use 9.11.2
```

Install Gulp:
```bash
npm install -g gulp
```

## MongoDB Setup
This project has only been tested on Ubuntu 22.04 which has some issues with MongoDB v8.0 — use MongoDB v7.0.43 instead.

Import the MongoDB public GPG key:
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

Create the list file:
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

Reload the package database and install MongoDB:
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

Start the MongoDB daemon (i.e., "mongod") process:
```bash
sudo systemctl start mongod
```

Start the MongoDB shell (i.e., "mongosh") process:
```bash
mongosh
```

Setup the database and user accounts:
- Type `use <database_name>` to create a database.
- Type `db.new_collection_insert({ <random_key>: "<random_value>" })` to initialize the database.
- Type the following to create a database user:
```javascript
db.createUser(
  {
    user: "<username>",
    pwd: "<password>",
    roles: [ { role: "readWrite", db: "<database_name>" } ]
  }
)
```
- Type `quit()` to exit MongoDB shell.

## OAuth Setup
Get OAuth keys for authentication platform of your choice (e.g., GitHub, Twitter, Google, Facebook, VKontakte, etc.)

If you want to add other sign-in methods, you need to find the appropriate [passport](https://www.passportjs.org/) package and add it in `src/ts/server/oauth.ts` and add the correct entry into `config.json`.

### GitHub
- Go to https://github.com/settings/developers to create a new OAuth application.
- Set authorization callback URL to `http://localhost:8090/auth/github/callback`.
- Add this to the `oauth` field in your `config.json`:
```json
"github": {
  "clientID": "<your_client_id>",
  "clientSecret": "<your_client_secret>"
}
```

### Twitter
- Go to https://developer.twitter.com/en/apps to create a new application.
- Set callback URL to `http://localhost:8090/auth/twitter/callback`.
- Add this to the `oauth` field in your `config.json`:
```json
"twitter": {
  "consumerKey": "<your_consumer_key>",
  "consumerSecret": "<your_consumer_secret>"
}
```

### Google
- Go to https://console.developers.google.com/apis/dashboard and create a new project, then go to credentials and create a new entry.
- Add `http://localhost:8090` to the Authorized JavaScript origins.
- Add `http://localhost:8090/auth/google/callback` to the Authorized Redirect URIs.
- Add this to the `oauth` field in your `config.json`:
```json
"google": {
  "clientID": "<your_client_id>",
  "clientSecret": "<your_client_secret>"
}
```

### Facebook
- Go to https://developers.facebook.com/apps/ to add a new app.
- Add Facebook Login product to your application.
- Enable Web OAuth Login.
- Add `https://localhost:8090/auth/facebook/callback` to Valid OAuth Redirect URIs.
- Add this to the `oauth` field in your `config.json`:
```json
"facebook": {
  "clientID": "<your_app_id>",
  "clientSecret": "<your_app_secret>",
  "graphApiVersion": "v3.1"
}
```
*Note: You can find App ID and App Secret in `Settings > Basic` section.*

### VKontakte
- Go to https://vk.com/apps?act=manage and create a new application.
- Set Authorized Redirect URI to `http://localhost:8090/auth/vkontakte/callback`.
- Add this to the `oauth` field in your `config.json`:
```json
"vkontakte": {
  "clientID": "<your_app_id>",
  "clientSecret": "<secure_key>"
}
```

## Configuration
Add `config.json` in the root directory with the following content:
```javascript
{
  "title": "Pony Town",
  "twitterLink": "https://twitter.com/<twitter_name>", // Optional — Add the Twitter icon at the page footer.
  "patreonLink": "https://patreon.com/<patreon_name>", // Optional — Add the Patreon icon at the page footer.
  "contactEmail": "<your_contact_email>",
  "port": 8090,
  "adminPort": 8091,
  "host": "http://localhost:8090/",
  "local": "localhost:8090",
	"adminLocal": "localhost:8091",
  "secret": "<some_random_string_here>",
  "token": "<some_random_string_here>",
  "db": "mongodb://<username>:<password>@localhost:27017/<database_name>", // Use the credentials you created in MongoDB here.
  "analytics": { // Optional — Add Google Analytics support.
    "trackingID": "<tracking_id>"
  },
  "facebookAppId": "<facebook_id>", // Optional — Add Facebook application link.
  "assetsPath": "<path_to_graphics_assets>", // Optional — For asset generation only.
  "oauth": {
		"github": {
			"clientID": "<CLIENT_ID_HERE>", // Add GitHub client ID from the OAuth application here.
			"clientSecret": "<CLIENT_SECRET_HERE>" // Add GitHub client secret from the OAuth application here.
		}
  },
  "servers": [
    {
      "id": "dev",
      "port": 8090,
      "path": "/s00/ws",
      "local": "localhost:8090",
      "name": "Dev server",
      "desc": "Development server",
      "flag": "test", // Optional — Add country flag (use "test", "star", or space-separated list of country flags).
      "flags": {
        "test": true, // Optional — Add the test server feature flag.
        "editor": true, // Optional — Add the in-game editor feature flag.
      },
      "alert": "18+", // Optional — Add the 18+ alert (also blocks underage players).
    },
  ]
}
```
*Note: Remove all comments before building project.*

## Building
Create the logs directory (required at startup):
```bash
mkdir logs
```

Clean install (also ensure no lock file exists):
```bash
rm -rf node_modules
npm install
```

Pin older TypeScript version:
```bash
npm install typescript@3.5.3
```

Patch `tsconfig.json` by adding these to the `compilerOptions` block:
```bash
"skipLibCheck": true,
"allowUmdGlobalAccess": true
```

Pin all dependencies (after clean install):
```bash
npm install minimatch@3.0.4 glob@7.1.6 brace-expansion@1.1.11 @types/chai@4.2.7 @types/babel-types@7.0.7 @types/express-serve-static-core@4.16.1 @types/lodash@4.14.141 @nodelib/fs.walk@1.2.2 @nodelib/fs.scandir@2.1.3 @types/bluebird@3.5.29 @types/node@12.12.50 @nodelib/fs.stat@2.0.3 bson@1.1.6 webpack-cli@3.3.10 fast-glob@2.2.7 @types/express@4.17.1 globby@9.2.0 del@4.1.1 mongoose@5.6.11 @types/mongoose@5.5.15 @types/mongodb@3.3.1 @types/bson@1.0.11 @types/minimatch@3.0.3 @types/file-saver@2.0.1 @types/passport@0.4.0
```

Remove orphaned nested copies (if required):
```bash
rm -rf node_modules/fast-glob/node_modules/@nodelib
rm -rf node_modules/@types/express/node_modules/@types/express-serve-static-core
rm -rf node_modules/globby/node_modules/@nodelib
rm -rf node_modules/del/node_modules/@nodelib
...
```

In `src/ts/common/rollbar.ts` on line 84, locate this:
```bash
return arg.message + (arg.stack || '');
```
And update it to this:
```bash
return (arg as any).message + ((arg as any).stack || '');
```

Freeze the dependency tree:
```bash
npm shrinkwrap
```

Build the project:
```bash
npm run build
```
*Note: If you get any TypeScript errors, you probably missed a step.*

### Why do we need to pin dependency versions?
The original repository had no `package-lock.json` and uses `^` ranges throughout.\
This means NPM resolves every transitive dependency to its latest version.\
The modern versions of these packages use TypeScript syntax (e.g., import type, asserts, "#private", etc.) that the older TypeScript 3.5.3's parser can't read OR have stricter type definitions that break the 2019-era source code.\
Pinning restores the 2019 dependency tree the project was developed against around that time.

## Running
To run a production environment:
```bash
npm start
```

To add roles (e.g., "superadmin", "admin", "mod", "dev", etc.):
```bash
node cli.js --addrole <account_id> <role>
```

To remove roles:
```bash
node cli.js --addrole <your_account_id> <role>
```
*Note: The admin panel is accessible at `http://localhost:8090/admin/` and requires admin role to access. Tools are accessible at `http://localhost:8090/tools/` and is only available in dev mode or when starting with the `--tools` flag.*

Running as multiple processes:
```bash
node pony-town.js --login                    # Login server
node pony-town.js --game main                # Game server 1 ("main" has to match id from config.json)
node pony-town.js --game safe                # Game server 2 ("safe" has to match id from config.json)
node pony-town.js --admin --standaloneadmin  # Admin server
```
*Note: For these to work on the same URL, paths to game servers and the admin server needs to be bound to correct ports using an HTTP proxy.*

It's recommended to run processes with a larger memory pool for larger user bases:
```bash
node --max_old_space_size=8192 pony-town.js --game main
```

To run a beta environment:
```bash
npm run build-beta
node pony-town.js --login --admin --game --tools --beta
```

Running in development:
```bash
npm run ts-watch    # Terminal 1
npm run wds         # Terminal 2
gulp dev            # Terminal 3
```
```bash
gulp dev --sprites  # Run with generation of sprite sheets (use src/ts/tools/trigger.txt to trigger sprite generation without restarting gulp)
gulp dev --test     # Run with tests
gulp dev --coverage # Run with tests and code coverage
```

## Customization
- `package.json` — Settings for title and description of the website
- `assets/images` — Logos and team avatars
- `public/images` — Additional logos
- `public` — Privacy policy and terms of service
- `favicons` — Icons
- `src/ts/common/constants.ts` — Global settings
- `src/ts/server/maps/*` — Maps configuration and setup
- `src/ts/server/start.ts` — World setup
- `src/ts/components/services/audio.ts` — Adding and removing sound tracks
- `src/ts/client/credits` — Credits and contributors
- `src/style/partials/_variables.scss` — Page style configuration

### Custom Map Introduction
- `src/ts/server/start.ts:35` — Adding a custom map to the world
- `src/ts/server/map/customMap.ts` — Commented introduction to customizing maps

# License
The source code for this repository is licensed under the **Unlicense** license.
For more information, click [here](https://unlicense.org/).\
All art and music in this repository are licensed under the **CC-BY-NC-4.0** license.
For more information, click [here](https://creativecommons.org/licenses/by-nc/4.0/legalcode.txt).

# Credits
### ART
- Shino (https://www.deviantart.com/shinodage)
- ChiraChan (https://www.deviantart.com/chiramii-chan, https://chirachan-art.tumblr.com/)
- Velenor (https://www.deviantart.com/velenor)
- ShareMyShipment (https://www.deviantart.com/sharemyshipment)
- Paulpeoples (https://www.deviantart.com/paulpeopless)
- Meno (https://www.deviantart.com/menojar)
- Goodly (https://www.deviantart.com/goodlyay)
- TioRafaJP (https://www.deviantart.com/tiorafajp, https://www.youtube.com/user/RafaelJP2)
- CyberPon3 (https://www.deviantart.com/cyberpon3)
- OtakuAP (https://www.deviantart.com/otakuap)
- Disastral
- Velvet-Frost (https://www.deviantart.com/velvet-frost)
- Jet7Wave (https://www.deviantart.com/jetwave)
- Lalieri (https://lalieri.tumblr.com/)
- Ruef-bae (https://www.deviantart.com/ruef-bae)
- Alchemist3rd
- Firecracker
- ZippySqrl (https://www.deviantart.com/zippysqrl)
- Karnel333
- Wellfugzee
- ScribblesHeart (https://www.deviantart.com/scribblesdesu)
- dsp2003 (https://dsp2003.tumblr.com/, http://www.deviantart.com/dsp2003)
- MysticBlare (https://twitter.com/MysticBlare)
- Towmacow Waffles (https://www.deviantart.com/towmacowwaffles)
- OrchidPony (https://www.deviantart.com/orchidpony)
- Cherry Cerise (https://www.deviantart.com/cherryceriseart)
- Radio
- Ultimate Fluff
- SC (https://0somecunt0.tumblr.com/tagged/sfw)
- SailorDolpin (https://vk.com/id324582699)
- Deeraw (https://www.deviantart.com/deerdraw, https://twitter.com/TheOnlyDeeraw)

### MUSIC
- Wandering Artist (https://wanderingartist.bandcamp.com/, https://www.youtube.com/user/WanderingArtistMusic)