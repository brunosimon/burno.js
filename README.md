Burno.js
========

#### Yet another JS framework ####

Burno.js (or **B.js**) is a light (< 40ko) and simple **JS framework** made to help you develop well structured web applications quickly.
Because Internet is a place of love and sharing, here it is.

You can organize your web application into **Components** and **Tools**. It comes with some useful premade [tools](#tools).
Simply include the JS files in your HTML and start using it. B.js is still in development, don't hesitate if you have any advice.

**Table of contents**

* [Compatibility](#compatibility)
* [Usage](#usage)
    * [As a library](#as-a-library-the-easy-way)
    * [As a framework](#as-a-framework-the-powerful-way)
* [Core classes](#core-classes)
    * [Abstract class](#abstract-class)
    * [Event Emitter class](#event-emitter-class)
* [Tools](#tools)
    * [Browser](#browser)
    * [Colors](#colors)
    * [GA tags](#ga-tags)
    * [Keyboard](#keyboard)
    * [Mouse](#mouse)
    * [Ticker](#ticker)
    * [Registry](#registry)
    * [Css](#css)
    * [Resizer](#resizer)
* [Todo](#todo)
* [Changelog](#changelog)


## Compatibility

B.js has no dependencies (no, you don't need jQuery).
It's compatible with all modern browsers down to IE8 (included).<br />
Depending on the browsers and classes you are using, you may need polyfills which are included in the [src/polyfills](src/polyfills) folder.


## Usage

There are two ways of using B.js.<br />
You can use it as a simple library by instantiating the tools or you can use it as a Framework by extending B.js to create your own tools and components.

#### As a library (the easy way)

* Include the build in your HTML

```html
<script src="../../build/burno-0.1.min.js"></script>
```

* Instantiate the tools you need
* Start using them

```javascript
var browser = new B.Tools.Browser();

browser.on( 'resize', function( viewport )
{
    console.log( 'viewport height ', viewport.height );
} );
```


#### As a framework (the powerful way)

Create your own tools and components based on B.js classes. You can put your components inside `B.Components` object or you can create your own namespace like `Foo.Bar.My_Class`.<br/>
Inheritance is based on the [John Resig code](http://ejohn.org/blog/simple-javascript-inheritance/) with some improvements like deep property merging.<br />
B.js is developed in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). Do as you whish and feel free to share your custom tools and components.

* Include the build in your HTML

```html
<script src="../../build/burno-0.1.min.js"></script>
```

* Create your own tools and components based on B.js **Abstract** or **Event Emitter** classes (you may want to put each class in a different file)

```javascript
// Create a class wrapping the all application
B.Components.My_App = B.Core.Abstract.extend(
{
    init : function()
    {
        // Instantiate a sidebar and header
        this.sidebar = new B.Components.My_Sidebar( { color : 'blue' } );
        this.header  = new B.Components.My_Header();
    }
} );

// Create a class for the sidebar
B.Components.My_Sidebar = B.Core.Abstract.extend(
{
    // Default options
    options :
    {
        colors : 'red'
    },

    init : function( options )
    {
        this._super( options );

        this.main = document.querySelector( 'aside' );

        console.log( 'Init Sidebar' );
    }
} );

// Create a class for the header
B.Components.My_Header = B.Core.Abstract.extend(
{
    init : function()
    {
        this.main = document.querySelector( 'header' );

        console.log( 'Init Header' );
    }
} );
```
* Launch :tada:
```javascript
// Let's rock
var my_app = new B.Components.My_App();
```
* Have a beer :beer:

# Core classes

Core classes are base classes you want to extend if your building custom components and tools.

## Abstract Class

`B.Core.Abstract` is the default class.

* `extend` method
* `init` method (called when instantiated)
* `options` property that will be merged (see example bellow)
* `static` property to set the class as a singleton (can be instantiated only one time)


###### Default
```javascript
// Inherit from Abstract
B.Components.Custom_Class = B.Core.Abstract.extend(
{
    init : function()
    {
        console.log( 'Welcome to my custom class' );
    }
} );

var custom_class = new B.Components.Custom_Class();
```

###### Options with deep merging
```javascript
B.Components.Custom_Class = B.Core.Abstract.extend(
{
    // Options with random deep properties
    options :
    {
        test :
        {
            foo   : 'bar',
            lorem : 'ipsum'
        }
    },

    // Add options argument
    init : function( options )
    {
        // Pass options to _super
        this._super( options );

        console.log( 'Options', this.options );
    }
} );

// Instantiate by passing different options
var custom_class = new B.Components.Custom_Class( {
    test :
    {
        lorem : 'dolores'
    }
} );
```

###### Static / Singleton

```javascript
// Currently, static functionnality is only used for tools
// It's just a matter of organization, do whatever you want.
B.Tools.Custom_Class = B.Core.Event_Emitter.extend(
{
    // Chose a name never used
    static : 'custom_tool',

    init : function()
    {
        // Don't forget the _super
        this._super();

        console.log( 'Init' );
    }
} );

// 'custom_class' and 'custom_class_again' will share the same instance
// 'init' will be called only the first time
var custom_class       = new B.Tools.Custom_Class(),
    custom_class_again = new B.Tools.Custom_Class();
```


## Event Emitter Class

`B.Core.Event_Emitter` extends `B.Core.Abstract` with extra event methods.

* `on`, `off` and `trigger` methods
* Multiple events listening
* Event parameters
* Namespace
* Automatically normalized event names (`event-name` == `eventname` == `event_name`)

###### Default example
```javascript
// Create a custom component that extends Event_Emitter
B.Components.Custom_Component = B.Core.Event_Emitter.extend(
{
    init : function()
    {
        this._super();

        // Save context
        var that = this;

        // Interval every seconds
        window.setInterval( function()
        {
            // Trigger event and pass parameters
            that.trigger( 'event-test', [ 'test-1' ] );
        }, 1000 );
    }
} );

var custom_component = new B.Components.Custom_Component();

// Listen to 'event-text'
custom_component.on( 'event-test', function( value )
{
    // Will log 'text-1' every second
    console.log( value );
} );
```

###### Namespace example
```javascript
// Create a custom component that extends Event_Emitter
B.Components.Custom_Component = B.Core.Event_Emitter.extend(
{
    init : function()
    {
        this._super();

        // Save context
        var that = this;

        // Wait a second
        window.setTimeout( function()
        {
            // Trigger some events
            that.trigger( 'event-1', [ 'test-1' ] );
            that.trigger( 'event-2', [ 'test-2' ] );
            that.trigger( 'event-3', [ 'test-3' ] );
            that.trigger( 'event-4', [ 'test-4' ] );
        } );
    }
} );

// Try to instantiate twice but get a common object each time
var custom_component = new B.Components.Custom_Component();

// Listen two events
custom_component.on( 'event-1 event-2', function( value )
{
    console.log( value );
} );

// Stop listening to 'event-1' event
custom_component.off( 'event-1' );

// Listen to event with namespace
custom_component.on( 'event-2.foo event-3.bar event-4.bar', function( value )
{
    console.log( value );
} );

// Stop listening on 'event-2' with 'foo' namespace
custom_component.off( 'event-2.foo' );

// Stop listening on every events with 'bar' namespace
custom_component.off( '.bar' );
```

# Tools

B.js comes with some premade tools. Each one is a singleton (static). You can instantiate it multiple times, you will always get the first instance.

You can extend those tools if you want.

* [Browser](#browser)
* [Colors](#colors)
* [GA tags](#ga-tags)
* [Keyboard](#keyboard)
* [Mouse](#mouse)
* [Ticker](#ticker)
* [Registry](#registry)
* [Css](#css)
* [Resizer](#resizer)

## Browser

Gives you informations like system, browser, engine, viewport and methods to handle breakpoints and media queries.<br />
Breakpoints works a little like width and height for media queries. Specify some breakpoints and the class will trigger events when resizing the viewport.

[See code](src/tools/browser.class.js)<br />
[See example](demos/tools/browser.html)

**Options**
```javascript
{
    disable_hover_on_scroll : true,       // Improve performance when scrolling but disable hovers
    initial_trigger         : true,       // Trigger 'scroll' and 'resize' events on the next frame
    add_classes_to          : [ 'html' ], // Add detect informations to selectors in array
    breakpoints             : [           // Breakpoints
        {
            name     : 'large',
            limits   :
            {
                width :
                {
                    value    : 960,
                    extreme  : 'min',
                    included : false
                }
            }
        },
        {
            name     : 'medium',
            limits   :
            {
                width :
                {
                    value    : 960,
                    extreme  : 'max',
                    included : true
                }
            }
        }
    ]
}
```

**Properties**

* **viewport** (object) Informations about the viewport
    * `top` | `y` (number) Scroll top
    * `left` | `x` (number) Scroll left
    * `delta` (object)
        * `top` | `y` (number) Scroll delta top
        * `left` | `x` (number) Scroll delta left
    * `direction` (object)
        * `y` (string) Vertical scroll direction
        * `x` (string) Horizontal scroll direction
    * `width` (number) Width
    * `height` (number) Height
* **pixel_ratio** (number) Pixel ratio
* **detect** (object)
    * `enfine` (object) Liste of engines with boolean true if detected
    * `browser` (object) Liste of browsers with boolean true if detected
    * `system` (object) Liste of systems with boolean true if detected
    * `features` (object) Liste of features with boolean true if detected
* **breakpoints** (object)
    * `all` (array) Every current breakpoints
    * `currents` (array) Every active breakpoints
    * `currents_names` (array) Names of every active breakpoints

**Methods**

* **match_media**
    * `condition` (string) Proceed to a classic matchMedia but only return a boolean
* **add_breakpoint**
    * `breakpoint` (object) Add a breakpoint
* **add_breakpoints**
    * `breakpoints` (array) Add multiple breakpoints

**Events**

* **resize**
    * `viewport` (object)
* **scroll**
    * `viewport` (object)
* **breakpoint**
    * `breakpoint` (string) Current breakpoint
    * `old_breakpoint` (string) Previous breakpoint

**Todo**

* Classes
* Breakpoints
* Disable hover on scroll
* Match media


## Colors

Help you convert strings to well formated colors.<br>
Create beautifuls rainbows. :rainbow:

[See code](src/tools/colors.class.js)<br />
[See example](demos/tools/colors.html)

**Options**
```javascript
{
    gradients :
    {
        parse   : true,          // Automatically parse, looking for text to convert to gradient
        target  : document.body, // Default target when parsing
        classes :
        {
            to_convert : 'gradient-text',           // Searched class
            converted  : 'gradient-text-converted', // Converted class
        }
    }
}
```

**Properties**

* **names** (object) Normalized colors (name to hexa)

**Methods**

* **any_to_rgb** : Try to convert anything to an RGB object
    `input` (string) Anything that looks like a color (#ff0000,#f00,red,{r:1,g:0,b:1},{h:1,s:1,l:0.5})
* **parse** : Parse the target looking for DOM elements to resize.
    * `target` (optional, DOM element, default: document.body)
    * `selector` (string, default: 'to-resize')
* **get_steps_colors** : Return every step colors from a specified one to another
    * `start` (any)
    * `end` (and)
    * `count` (number)
    * `format` (optional, string, values: *'rgb'* | *'hsl'*, default: *'hsl'*)
* **rgb_to_hsl** : Convert from RGB to HSL
    `input` (object) RGB object
* **hsl_to_rgb** : Convert from HSL to RGB
    `input` (object) HSL object

**Events**

none


## GA Tags

Send informations to Google Analytics using the current instance.
You must instantiate Google Analytics yourself.

[See code](src/tools/ga_tags.class.js)<br />
[See example](demos/tools/ga_tags.html)

**Options**
```javascript
{
    send               : true, // Should send informations
    parse              : true, // Automatically parse
    true_link_duration : 300,  // Wait duration before following the link (enough time to be sure that informations have been well stend)
    target  : document.body,   // Default target when parsing
    classes :
    {
        to_tag : 'tag',   // Search class
        tagged : 'tagged' // Tagged class
    },
    logs :
    {
        warnings : false, // Log warning
        send     : false  // Log sent informations
    }
}
```

**Properties**

none

**Methods**
* **parse** : Parse the target looking for DOM elements to resize.
    * `target` (optional, DOM element, default: document.body)
    * `selector` (string, default: 'to-resize')
* **send¨** : Send informations to Google Analytics
    * `datas` (object)
        * `category` (any)
        * `action` (any)
        * `label` (optional, any)
        * `value` (optional, any)
        * `unique` (optional, string) Should not send the data more than one time (depending on the string value)

**Events**

* **send**
    * datas (array) Sent datas


## Keyboard

Methods, properties and events relatives to the keyboard

[See code](src/tools/keyboard.class.js)<br />
[See example](demos/tools/keyboard.html)

**Options**

none

**Properties**

* **keycode_names** (object) Known keycodes that
* **downs** (array) Currently down characters (not keycodes)

**Methods**

* **keycode_to_character** : Convert keycode to character
    * `input` (number) Keycode
* **is_down** : Test if keycode or character specified is currently down
    * `input` (string|number) Keycode or character
* **are_down** : Test if keycodes or characters specified are currently down
    * `inputs` (array) Keycodes and/or characters

**Events**

* **down**
    * `keycode` (number)
    * `character` (string)
* **up**
    * `keycode` (number)
    * `character` (string)


## Mouse

Properties and events relatives to the mouse

[See code](src/tools/mouse.class.js)<br />
[See example](demos/tools/mouse.html)

**Options**

none

**Properties**

* **down** (boolean) Is mouse down
* **position** (object) Information about cursor position with automatically calculated ratio relative to screen
* **wheel** (object) Last wheel informations

**Methods**

none

**Events**

* **down**
    * `position` (object) Mouse position informations
    * `target` (DOM element) Direct element under the mouse position
    * If you wan't to prevent the default event, just return `false` in the callback
* **up**
    * `position` (object) Mouse position informations
    * `target` (DOM element) Direct element under the mouse position
* **move**
    * `position` (object) Mouse position informations
    * `target` (DOM element) Direct element under the mouse position
* **wheel**
    * `wheel` (object) Mouse wheel informations
    * If you wan't to prevent the default event, just return `false` in the callback

## Ticker

Run a ticker that trigger events each frame base on requestAnimationFrame.

[See code](src/tools/ticker.class.js)<br />
[See example](demos/tools/ticker.html)

**Options**
```javascript
{
    auto_run : true
}
```

**Properties**

* **running** (boolean) Is the ticker running now
* **time** (object) Informations about the time (ms)
    * `start` When did the ticker start last
    * `elapsed` Time spent
    * `delta` Time spent since last tick
    * `current` Current time

**Methods**

* **reset** : Reset the ticker
    * `run` (boolean) Should start running the timer
* **run** : Run the ticker
* **stop** : Stop the ticker
* **tick** : Trigger tick (If you need to trigger it manually)
* **do_next** : Apply function on the next frame
    * `action` (function)
    * `before` (optional, boolean) Should call the function before the `tick` event

**Events**

* **tick**
    * `time` (object) Time informations


## Registry

Key/value registry for when you need to store variable and retrieve it anywhere without using ugly global variables.
You may use it to cache variables.

[See code](src/tools/registry.class.js)<br />
[See example](demos/tools/registry.html)

**Options**

none

**Properties**

* items (array) Every stored items

**Methods**

* **get**
    * `key` (string)
    * `callback` (optional, function) Called if item not found for specified key and function result returned
* **set**
    * `key` (string)
    * `value` (any)

**Events**

none


## CSS

Apply CSS on targeted element and automatically add prefixes.
Property will automatically be formated.

[See code](src/tools/css.class.js)<br />
[See example](demos/tools/css.html)

**Options**

```javascript
{
    prefixes : [ 'webkit', 'moz', 'o', 'ms', '' ] // Default prefixes
}
```

**Properties**

none

**Methods**

* **apply** : Apply CSS on target and add prefixes
    * `target` (DOM element|jQuery) Element retrieved with classic fetcher like querySelector or jQuery
    * `values` (object) Value to apply
    * `prefixes` (optional, boolean|array) True for default prefixes or prefixes array

**Events**

none


## Resizer

Resize elements inside containers according to many possible options.
<br>May automatically parse and resize according to classes and attributes on containers.
<br>In order to work, you'll have to specify the following properties on the DOM elements themselves

* On the containers
    * `data-width` | `width` (optional, number)
    * `data-height` | `height` (optional, number)
* On the content
    * `data-width` | `width` (number)
    * `data-height` | `height` (number)
    * `data-fit-type` (optional, string, values: *'fill'* | *'fit'*, default: *'fill'*)
    * `data-align-x` (optional, string, values: *'left'* | *'center'* | *'right'*, default: *'center'*)
    * `data-align-y` (optional, string, values: *'top'* | *'center'* | *'bottom'*, default: *'center'*)
    * `data-rounding` (optional, string, values: *'ceil'* | *'floor'* | *'round'* | none, default: *'ceil'*)

[See code](src/tools/resizer.class.js)<br />
[See example](demos/tools/resizer.html)

**Options**

```javascript
{
    force_style : true,          // Add 'position' and 'overflow' CSS properties if not set yet
    parse       : true,          // Automatically parse
    target      : document.body, // Default target when parsing
    auto_resize : true,          // Resize on browser 'resize' event
    classes     :
    {
        to_resize : 'to-resize', // Containers searched class (on the container)
        content   : 'content'    // Content class (must be inside container)
    }
}
```

**Properties**

none

**Methods**

* **parse** : Parse the target looking for DOM elements to resize.
    * `target` (optional, DOM element, default: document.body)
    * `selector` (string, default: 'to-resize')
* **resize** : Resize the content inside his container
    * `container` (DOM element)
    * `content` (DOM element)
    * `force_style` (optional, boolean, default: true) Add 'position' and 'overflow' style properties if not set yet
* **resize_all** : Resize every content inside their containers
* **get_sizes** : Calculate and send back sizes needed to center the content inside the container
    * `parameters` (Object)
        * `content_width` (number)
        * `content_height` (number)
        * `container_width` (number)
        * `container_height` (number)
        * `fit_type` (optional, string, default: *fill*, value: *fill* | *fit*)
        * `align_x` (optional, string, default: *center*, value: *left* | *center* | *right*)
        * `align_y` (optional, string, default: *center*, value: *top* | *center* | *bottom*)
        * `rounding` (optional, string, default: *ceil*, value: *ceil* | *floor* | *round* | none)

**Events**

none


## Utils

#### Sublime Snippets

* Get sublime texts snippets from [utils/sublime-snippets/](utils/sublime-snippets/)
* On Sublime Text, go to `Preferences > Browse Packages...`
* Add the snippets anywhere inside `User/` folder

**bc** : Burno Class

```javascript
B.Components.Class = B.Core.Abstract.extend(
{
    static  : 'class',
    options : {},

    init : function( options )
    {
        this._super( options );


    }
} );
```

**bcs** : Burno Class Strict

```javascript
(function()
{
    'use strict';

    B.Components.Class = B.Core.Abstract.extend(
    {
        static  : 'class',
        options : {},

        init : function( options )
        {
            this._super( options );


        }
    } );
} )();
```

**bfn** : Burno Function

```javascript
/**
 * Description
 */
name : function( options )
{
    var that = this;

    this._super();


}
```

**bn** : Burno New

```javascript
new Burno.Namespace.Class();
```

**bnc** : Burno New Component

```javascript
new Burno.Components.Class();
```

**bnt** : Burno New Tool

```javascript
new Burno.Tools.Class();
```


## Todo

* ~~IE8 compatible~~
* Unit testing
* ~~Sublime snippets~~
* Classes (create)
    * Storyline
    * Navigation
    * Scroll
    * Page
    * Images
    * Loader
    * Strings
        * Capitalize
        * SnakeCase
        * CamelCase
        * PascalCase
        * Slugify
        * Is false (0, nop, no, false, nein, non, ...)
    * Time / Date
        * Formater (custom formats (sprinf like))
        * Local
* Classes (update)
    * CSS
        * IE translateZ and translate3d prevent (in options)
    * ~~Browser~~
        * ~~Array of breakpoints~~
        * ~~Breakpoint name to breakpoint object method~~
    * Event_Emitter
        * Deferred trigger (can specify event)
    * Better Match media
        * Multiple matches
        * Fallback for width and height
    * GA Tags
        * Dynamically add GA script with method "init( ua_code )"
            * Trigger event
    * Mouse
        * Wheel type detection
    * Colors
        * Better param names (input/output)
        * Better gradient (multiple steps)
        * Only one convertissor method (default any => rgb)
        * Use Strings Tool
    * Registry
        * Persistence (localstorage / cookie fallback)



## Changelog

#### 0.1.0 (2015-03-10)

Init


