# reddit-migrate

A command-line tool to migrate, export, import, and purge reddit account data!

<details><summary>Demo</summary>

![][term-migrate]

</details>

It migrates/exports/imports subscribed subreddits, followed users, friends, blocked users, multireddits, profile settings, and account preferences. It can also purge (mass-delete) your comments and submissions.

## Installation

    npm i -g cAttte/reddit-migrate

## Usage

    reddit-migrate [command] [options]

### Commands

#### help

Display command help.

#### migrate

Migrate to a new reddit account.

**Options:**

-   `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.
-   `-? <list>`, `--which <list>`: A comma-separated list of attributes to migrate, or 'all'.

#### import

Import data to a reddit account.

**Options:**

-   `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.
-   `-i <path>`, `--input <path>`: Path of the input file. **(required)**
-   `-? <list>`, `--which <list>`: A comma-separated list of attributes to import, or 'all'.

#### export

Export data from a reddit account.

**Options:**

-   `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.
-   `-o <path>`, `--output <path>`: Path of the output file. **(required)**
-   `-p`, `--pretty`: Whether to prettify the output JSON.
-   `-w`, `--overwrite`: Avoid the 'overwrite?' prompt if file already exists.
-   `-? <list>`, `--which <list>`: A comma-separated list of attributes to export, or 'all'.

#### purge

Mass-delete reddit account content.

**Options:**

-   `-e <path>`, `--env-file <path>`: Path of the .env file to load credentials from.
-   `-d <text>`, `--edit <text>`: Text to edit messages and posts to before deleting.
-   `-? <type>`, `--which <type>`: Submission type to delete; 'posts', 'comments', or 'all'.

### Credentials

As seen in the command options, you can pass the path/filename of a `.env` file, containing the credentials of the reddit account(s). However, if it's not provided (or the credentials are not included in the file), the CLI will prompt you to enter them:

![][term-credentials]

Check out [**example.env**][example-env] to find out how the file should look for each command.

#### Obtaining CLIENT_ID and CLIENT_SECRET

-   Head over to the [**Apps**][apps] section of your reddit account preferences.
-   Click on the **create app** button.
-   Type whatever in the **name** and **redirect URI** fields. Make sure to select the **script** app type.
-   Your client ID will be shown below the app name and type. The secret, next to the other app info.

## License

This project uses the [**MIT License**][mit-license]. [Check it out][license-md] for more info.

## TODO

-   [ ] Migrate/import profile picture and banner; these are not imported correctly with the URLs.
-   [x] Add an option to specify which data should be imported/exported/migrated.
-   [ ] Add a feature to "clear" data; unsubscribe from all subreddits, unfollow everyone, etc.
-   [x] Add a feature to mass delete comments and posts, optionally editing them before.
-   [ ] Move to a reddit API wrapper that doesn't suck ass (ie, not snoowrap).

<!-- References -->

[example-env]: https://github.com/cAttte/reddit-migrate/blob/master/example.env
[apps]: https://www.reddit.com/prefs/apps
[mit-license]: https://en.wikipedia.org/wiki/MIT_License
[license-md]: https://github.com/cAttte/reddit-migrate/blob/master/LICENSE.md
[term-migrate]: https://raw.githubusercontent.com/cAttte/reddit-migrate/master/terminal/migrate.svg
[term-credentials]: https://raw.githubusercontent.com/cAttte/reddit-migrate/master/terminal/credentials.svg
