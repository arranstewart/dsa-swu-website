
# Website for Data Structures and Algorithms at Southwest University, China

This is the website of the DSA course taught at SWU in Autumn 2021.
The course website is built with [eleventy][eleventy].
The 2021 version of the website can be seen at <https://arranstewart.github.io/dsa-swu-website/>.

The content of the website pages and lecture slides is copyright, but may be used pursuant to the
<a rel='license' href='https://creativecommons.org/licenses/by/4.0/' >Creative Commons Attribution 4.0 International License</a>.

The copyright for the problem sheets and code samples is held by their respective creators,
and their permission is required for distribution.

For current information on the DSA course, visit
<https://teaching.csse.uwa.edu.au/units/DSA-SWU/>.


[eleventy]: https://www.11ty.dev

## dependencies

Requires GNU make and docker, in order to build and serve locally.


## instructions:

- serve locally: `make serve`
- build: `make build`

Pass the BUILD_ENVIRONMENT variable to `make` to specify whether
you want the `development`, `production` or `gh-pages` environment.

e.g.

```
$ make BUILD_ENVIRONMENT=gh-pages build
```

