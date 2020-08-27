# reddit-migrate
A CLI written in JavaScript to migrate, export and import reddit account data!

Migrates subscribed subreddits, followed users, friends, blocked users, multireddits, profile settings and account preferences.

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

## License

This project is licensed under the [**MIT License**](https://en.wikipedia.org/wiki/MIT_License). Check out [LICENSE.md](https://github.com/cAttte/reddit-migrate/blob/master/LICENSE.md) for more info.

## TODO

- [ ] Migrate/import profile picture and banner; these are not imported correctly with the URLs.
- [ ] Add an option to specify which data should be import/exported/migrated, something like `--types subreddits,follows,blocks`.
- [ ] Add a feature to "clear" data; unsubscribe from all subreddits, unfollow everyone, etc.
- [ ] Add a feature to mass delete comments and posts, optionally editing them before.