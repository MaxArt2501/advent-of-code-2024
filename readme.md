# Advent of Code 2024

I'm participating to the 2024 edition of [Advent of Code](http://adventofcode.com/2024/), a nice little puzzle game for developers. It consists in solving a couple of Christmas-related programming puzzles, and it doesn't matter what language you're choosing as long as you get the solution. I warmly suggest to give it a try yourself!

To get the input for the puzzles, you'll have to log in to the site above and get your own source. I'll add an `input.txt` file in each directory with a sample input to work with. If you're getting the input in a browser window from the game's site, you can open your developer tools of choice and set

```js
let input = document.body.textContent;
```

Be warned, though, that not every solution can be executed on the browser's console, as some are meant to be run on node.js.

Here are the repositories for the solutions of the previous editions:

- [2015](https://github.com/MaxArt2501/advent-of-code-2015)
- [2016](https://github.com/MaxArt2501/advent-of-code-2016)
- [2017](https://github.com/MaxArt2501/advent-of-code-2017)
- [2018](https://github.com/MaxArt2501/advent-of-code-2018)
- [2019](https://github.com/MaxArt2501/advent-of-code-2019)
- [2020](https://github.com/MaxArt2501/advent-of-code-2020)
- [2021](https://github.com/MaxArt2501/advent-of-code-2021)
- [2022](https://github.com/MaxArt2501/advent-of-code-2022)
- [2023](https://github.com/MaxArt2501/advent-of-code-2023)

## SPOILER ALERT

I'm publishing my solutions online, each in their own `day-##` directory, which will also contain the texts of the puzzles. The solutions are merely meant to be a reference for comparison, to see the tricks I'm using and, eventually, to discuss about improvements and new ideas.

So, if you still haven't found the solution and wish to do it on your own, this is the due **SPOILER ALERT**.


## Retrieving sources

Use the utility `retrieve.js` to retrieve the daily challenges and the input data. Usage example:

```
node --env-file=.env retrieve.js 7
```

where `7` is the day you want to retrieve challenge and data from. They'll be saved as `readme.md` and `input.txt`, respectively, in a folder named `day-7` (in this case).

In order to run the script, first you must create a `.env` file containing two properties:

- `YEAR`: I think this doesn't need to be explained...
- `SESSION_TOKEN`: you can get this value in the cookie `session` set by the site. It should be a 128 character long hexadecimal value (for 2024), where the first 16 bytes should be `'53616c7465645f5f'`, representing the string `'Salted__'`.

You need Node.js 20 or higher in order to use [the flag `--env-file`](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs), otherwise you'll have to load the values yourself.
