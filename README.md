# reddit-migrate
A CLI written in JavaScript to migrate, export, and import reddit account data!

Migrates subscribed subreddits, followed users, friends, blocked users, multireddits, profile settings, and account preferences.

## Installation
```
npm i -g cAttte/reddit-migrate
```

## Usage
```
reddit-migrate [command] [options]
```

### Commands

#### help
Display command help.
```
reddit-migrate help [command]
```

#### migrate
Migrate to a new reddit account.
```
reddit-migrate migrate [options]
```

**Options:**
- `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.

#### import
Import data to a reddit account.
```
reddit-migrate import [options]
```

**Options:**
- `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.
- `-i <path>`, `--input <path>`: Path of the input file.

#### export
Export data from a reddit account.
```
reddit-migrate export [options]
```

**Options:**
- `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.
- `-o <path>`, `--output <path>`: Path of the output file.
- `-p`, `--pretty`: Whether to prettify the output JSON.

### Credentials
As seen in the command options, you can pass the path/filename of a `.env` file, containing the credentials of the reddit account(s). However, if it's not provided (or the credentials are not included in the file), the CLI will prompt you to enter them:

![][carbon-credentials]

Check out [**example.env**][example-env] to find out how the file should look for each command.

#### Obtaining CLIENT_ID and CLIENT_SECRET
- Head over to the [**Apps**][apps] section of your reddit account preferences.
- Click on the **create app** button.
- Type whatever in the **name** and **redirect URI** fields. Make sure to select the **script** app type.
- Your client ID will be shown below the app name and type. The secret, next to the other app info.

## License

This project uses the [**MIT License**][mit-license]. [Check it out][license-md] for more info.

## TODO

- [ ] Migrate/import profile picture and banner; these are not imported correctly with the URLs.
- [ ] Add an option to specify which data should be imported/exported/migrated.
- [ ] Add a feature to "clear" data; unsubscribe from all subreddits, unfollow everyone, etc.
- [ ] Add a feature to mass delete comments and posts, optionally editing them before.

<!-- References -->
[carbon-credentials]: https://i.imgur.com/f0RoKaC.png
[example-env]: https://github.com/cAttte/reddit-migrate/blob/master/example.env
[apps]: https://www.reddit.com/prefs/apps
[mit-license]: https://en.wikipedia.org/wiki/MIT_License
[license-md]: https://github.com/cAttte/reddit-migrate/blob/master/LICENSE.md