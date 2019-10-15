# Platformer Portfolio

A unique way to show off my [Portfolio](http://taylornodell.com).

-   Based on the game engine made in this [original article](http://codeincomplete.com/posts/2013/5/27/tiny_platformer/), view the [source](https://github.com/jakesgordon/javascript-tiny-platformer)
-   I used the [Tiled Map Editor](http://www.mapeditor.org/) to build the stage
-   Projects are illuminated when the player stands on a platform
-   Click events above platforms also illuminate projects

# Running Locally

1. `npm install`
2. `gulp serve`

# TO DOs

-   Mobile implementation:
    -   When displaying fact div the new div obscures the view
    -   Camera could move?
-   Add live clients?
-   Render Headlines Once with original map render

# ATTRIBUTIONS

-   [Jake Gordon](http://codeincomplete.com/) - Original Game Engine
-   [Modernizer](https://modernizr.com/) - Mobile Detection
-   [Noun Project](https://thenounproject.com/) - Arrow Icons
-   [Tiled](http://www.mapeditor.org/) - Map Builder

# FRAMEWORKS AND LIBRARIES

-   [Modernizer](https://modernizr.com/)
-   [jQuery](https://jquery.com/)
-   [jQuery UI](https://jqueryui.com/)
-   [Tiled](http://www.mapeditor.org/)

# BUGS

-   Clicking causes links to stay on the first platforms link. ie Clicking nodejs then Javascript game displays the javascript game, but the link is nodejs
-   Clicking while character is on a platform causes divs to lay on top on eachother

# SUPPORTED BROWSERS

Modern browsers with canvas support

# DEVELOPMENT

The game is 100% client side javascript, html and css. It should run when served up by any web server.

# License

[MIT](http://en.wikipedia.org/wiki/MIT_License) license.
