Burno.js
========

#### Yet another JS framework ####

Burno.js (or **B.js**) is a light (< 40ko) and simple **JS framework** made to help you develop well structured web applications quickly.

You can organize your web application into **Components** and **Tools**. It comes with some useful premade stuff.
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
    * [Breakpoints](#breakpoints)
    * [Colors](#colors)
    * [Css](#css)
    * [Detector](#detector)
    * [GA tags](#ga-tags)
    * [Keyboard](#keyboard)
    * [Konami Code](#konami-code)
    * [Mouse](#mouse)
    * [Registry](#registry)
    * [Resizer](#resizer)
    * [Strings](#strings)
    * [Ticker](#ticker)
    * [Viewport](#viewport)
* [Todo](#todo)
* [Changelog](#changelog)


## Compatibility

B.js has no dependencies (no, you don't need jQuery).
It's compatible with all modern browsers down to IE8.<br>
Depending on the browsers and classes you are using, you may need polyfills which are included in the [src/polyfills](src/polyfills) folder.<br>
The default build includes all needed polyfills but you can use the `no-compatibility` version.


## Usage

There are two ways of using B.js.<br>
You can use it as a simple library by instantiating the tools or you can use it as a Framework by extending B.js to create your own tools and components.

#### As a library (the easy way)

* Include the build in your HTML

```html
<script src="../../builds/burno-0.3.min.js"></script>
```

* Instantiate the tools you need
* Start using them

```javascript
var viewport = new B.Tools.Viewport();

viewport.on( 'resize', function( width, height )
{
    console.log( width, height );
} );
```


#### As a framework (the powerful way)

Create your own tools and components based on B.js classes. You can put your components inside `B.Components` object or you can create your own namespace like `Foo.Bar.My_Class`.<br/>
Inheritance is based on the [John Resig code](http://ejohn.org/blog/simple-javascript-inheritance/) with some improvements like deep property merging, singleton, defualt options, etc.<br>
B.js is developed in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). Do as you whish and feel free to share your custom tools and components.

* Include the build in your HTML

```html
<script src="../../builds/burno-0.3.min.js"></script>
```

* Create your own tools and components based on B.js **Abstract** or **Event Emitter** classes (you may want to put each class in a different file)

```javascript
// Create a class wrapping the all application
B.Components.My_App = B.Core.Abstract.extend(
{
    construct : function()
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

    construct : function( options )
    {
        this._super( options );

        this.main = document.querySelector( 'aside' );

        console.log( 'Init Sidebar' );
    }
} );

// Create a class for the header
B.Components.My_Header = B.Core.Abstract.extend(
{
    construct : function()
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

Core classes are the foundations of B.js.<br>
Every tool or component inherit from one of those classes and your custom classes should too.

## Abstract Class

`B.Core.Abstract` is the default class.

* Can be extended
* `construct` method will be called when instantiated
* `static` property set the class as a Singleton. That mean that the first instiantiation with `new` will act normally but every next instiantiation with `new` will return the first one.
* `options` property is an object that will be merge with the options when instantiated
* `register` property inside the `options` property will automatically add the instantiation to the [Registry](#registry) tool with the `register` value as key
* calling `_super( parameters )` inside a method will call the parent overrided method

###### Extend / Construct

```javascript
// Inherit from Abstract
B.Components.Custom_Class = B.Core.Abstract.extend(
{
    construct : function()
    {
        console.log( 'Welcome to my custom class' );
    }
} );

var custom_class = new B.Components.Custom_Class();
```

###### Options (with deep merging)

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
    construct : function( options )
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

    construct : function()
    {
        // Don't forget the _super
        this._super();

        console.log( 'Init' );
    }
} );

// 'custom_class' and 'custom_class_again' will share the same instance
// 'construct' will be called only the first time
var custom_class       = new B.Tools.Custom_Class(),
    custom_class_again = new B.Tools.Custom_Class();
```

###### Registring (with Registry tool)

```javascript
// Create any class you'd like
B.Components.Test_Class = B.Core.Abstract.extend( {} );

// Instantiate and specify the register property in options object
// The value is the key you want to retrieve the instance later
var test_class = new B.Components.Test_Class( { register : 'my_key' } );

// Instantiate the registry tools and get the test_class using the register key
var registry     = new B.Tools.Registry(),
    test_class_2 = registry.get( 'my_key' );
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
    construct : function()
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
    construct : function()
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

* [Breakpoints](#breakpoints)
* [Colors](#colors)
* [Css](#css)
* [Detector](#detector)
* [GA tags](#ga-tags)
* [Keyboard](#keyboard)
* [Konami Code](#konami-code)
* [Mouse](#mouse)
* [Registry](#registry)
* [Resizer](#resizer)
* [Strings](#strings)
* [Ticker](#ticker)
* [Viewport](#viewport)


## Breakpoints

Breakpoints works a little like width and height for media queries. Specify some breakpoints and it will trigger events when resizing the viewport.

[See code](src/tools/breakpoints.class.js)<br>
[See example](demos/tools/breakpoints.html)

**Options**
```javascript
{
    breakpoints : [ // Breakpoints
        {
            name  : 'large',
            width :
            {
                value    : 960,
                extreme  : 'min',
                included : false
            }
        },
        {
            name  : 'medium',
            width :
            {
                value    : 960,
                extreme  : 'max',
                included : true
            }
        },
        {
            name  : 'small',
            width :
            {
                value    : 500,
                extreme  : 'max',
                included : true
            },
            height :
            {
                value    : 500,
                extreme  : 'max',
                included : true
            }
        }
    ]
}
```

**Properties**

* **all** (array) Every registered breakpoints
* **actives** (array) Actives breakpoints

**Methods**

* **add**
    * `breakpoints` (object|array) Add one are multiple breakpoints
    * `silent` (optional, boolean, default: true) Should not trigger event
* **remove**
    * `breakpoints` (string|array) Remove one are multiple breakpoints by name
    * `silent` (optional, boolean, default: false) Should not trigger event
* **is_active**
    * `breakpoint` (string) Test if breakpoint is curently active
* **match_media**
    * `condition` (string) Proceed to a classic matchMedia but only return a boolean

**Events**

* **update**
    * `breakpoints` (array) Currently active breakpoints


## Colors

Help you convert strings to well formated colors.<br>
Create beautifuls rainbows. :rainbow:

[See code](src/tools/colors.class.js)<br>
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
            to_convert : 'gradient-text',          // Searched class
            converted  : 'gradient-text-converted' // Converted class
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


## CSS

Apply CSS on targeted element and automatically add prefixes.
Property will automatically be formated.

[See code](src/tools/css.class.js)<br>
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


## Detector

Provide informations like engine, browser, system and features.

[See code](src/tools/detector.class.js)<br>
[See example](demos/tools/detector.html)

**Options**
```javascript
{
    targets : [ 'html' ] // Add detected informations to targets in array (selector or DOM Elements)
}
```

**Properties**

* **engine** (object)
    * `ie` (number)
    * `gecko` (number)
    * `webkit` (number)
    * `khtml` (number)
    * `opera` (number)
    * `version` (number)
* **browser** (object)
    * `ie` (number)
    * `firefox` (number)
    * `safari` (number)
    * `konq` (number)
    * `opera` (number)
    * `chrome` (number)
    * `version` (number)
* **system** (object)
    * `windows` (boolean)
    * `mac` (boolean)
    * `osx` (boolean)
    * `iphone` (boolean)
    * `ipod` (boolean)
    * `ipad` (boolean)
    * `ios` (boolean)
    * `blackberry` (boolean)
    * `android` (boolean)
    * `opera_mini` (boolean)
    * `windows_mobile` (boolean)
    * `wii` (boolean)
    * `ps` (boolean)
* **features** (object)
    * `touch` (boolean)
    * `media_query` (boolean)

**Methods**

none

**Events**

none


## GA Tags

Send informations to Google Analytics using the current instance.
You must instantiate Google Analytics yourself.

[See code](src/tools/ga_tags.class.js)<br>
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

[See code](src/tools/keyboard.class.js)<br>
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


## Konami Code

Know when your users use the konami code ↑ ↑ ↓ ↓ ← → ← → B A

[See code](src/tools/konami_code.class.js)<br>
[See example](demos/tools/konami_code.html)

**Options**

```javascript
{
    reset_duration : 1000, // Time in before reseting
    sequence :             // Sequence to enter
    [
        'up',
        'up',
        'down',
        'down',
        'left',
        'right',
        'left',
        'right',
        'b',
        'a'
    ]
}
```

**Properties**

none

**Methods**

none

**Events**

* **used**
* **timeout**
    * `index` (int) Progress before timeout
* **wrong**
    * `index` (int) Progress before failing


## Mouse

Properties and events relatives to the mouse

[See code](src/tools/mouse.class.js)<br>
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


## Registry

Key/value registry for when you need to store variable and retrieve it anywhere without using ugly global variables.<br>
You may use it to cache variables.

[See code](src/tools/registry.class.js)<br>
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

* **update**
    * `key` (string)
    * `value` (any)


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

[See code](src/tools/resizer.class.js)<br>
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
    * `parameters` (object)
        * `content_width` (number)
        * `content_height` (number)
        * `container_width` (number)
        * `container_height` (number)
        * `fit_type` (optional, string, default: *fill*, value: *fill* | *fit*)
        * `align_x` (optional, string, default: *center*, value: *left* | *center* | *right*)
        * `align_y` (optional, string, default: *center*, value: *top* | *center* | *bottom*)
        * `rounding` (optional, string, default: *ceil*, value: *ceil* | *floor* | *round* | none)
    * `format` (optional, string, default: *both*, value: *both* | *cartesian* | *css*)

**Events**

none


## Strings

Method to manage strings

[See code](src/tools/strings.class.js)<br>
[See example](demos/tools/strings.html)

**Options**

none

**Properties**

none

**Methods**

* **convert_case**
    * `value` (string) String that need to be case changed
    * `format` (string) Wanted case
        * camel
        * pascal
        * snake
        * dash
        * train
        * space
        * title
        * dot
        * slash
        * backslash
        * lower
        * upper
        * studlycaps
        * ... ([see code](src/tools/strings.class.js) for complete list)
* **trim**
    * `value` (string) String to trim
    * `characters` (string) Characters to trim
* **to_boolean**
    * `value` (string) Smartly convert to boolean with many supported languages
        * 0
        * false
        * nop
        * nein
        * non
        * ... ([see code](src/tools/strings.class.js) for complete list)
* **to_slug**
    * `value` (string) String to slugify

**Events**

none


## Ticker

Run a ticker that trigger events each frame base on requestAnimationFrame.

[See code](src/tools/ticker.class.js)<br>
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
* **wait** : Apply function after X frames
    * `frames_count` (number)
    * `action` (function)
    * `after` (optional, boolean, values: *true* | *false*, default: *true*) Should apply the function after the `tick` event is triggered

**Events**

* **tick**
    * `time` (object) Time informations
* **tick-X**
    * `time` (object) Time informations


## Viewport

Gives you informations about viewport like width, height, scroll top, scroll left, scroll delta, etc.<br>
Trigger events on scroll and resize.<br>
Can disable hover on scroll for performance improvement

[See code](src/tools/viewport.class.js)<br>
[See example](demos/tools/viewport.html)

**Options**
```javascript
{
    disable_hover_on_scroll : false,                 // Improve performance when scrolling but disable hovers
    initial_triggers        : [ 'resize', 'scroll' ] // On the next frame, triggers 'resize' then 'resize' events
}
```

**Properties**


* **top** | **y** (number) Viewport top
* **left** | **x** (number) Viewport left
* **scroll** | **x** (object) Informations about scroll
    * `delta` (object)
        * `top` | `y` (number) Scroll delta top
        * `left` | `x` (number) Scroll delta left
    * `direction` (object)
        * `y` (string) Vertical scroll direction
        * `x` (string) Horizontal scroll direction
* **pixel_ratio** (number) Pixel ratio

**Methods**

* **match_media**
    * `condition` (string) Proceed to a classic matchMedia but only return a boolean

**Events**

* **resize**
    * `viewport` (object)
* **scroll**
    * `viewport` (object)


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

    construct : function( options )
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

        construct : function( options )
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

- [x] UMD support
- [ ] NPM package
- [ ] :warning: Loop error bug
- [x] Unit testing
    - [x] Core
    - [x] Breakpoints
    - [x] Colors
    - [x] Css
    - [x] Detector
    - [x] GA Tags
    - [x] Keyboard
    - [x] Konami Code
    - [x] Mouse
    - [x] Registry
    - [x] Resizer
    - [x] Strings
    - [x] Ticker
    - [x] Viewport
- [x] camelCase / PascalCase aliases
- [ ] Classes (create)
    - [ ] Touch
    - [ ] Storyline
    - [ ] Navigation
    - [ ] Scroll
    - [ ] Images
        - [ ] Update images on pixel_ratio
        - [ ] Load and show image
    - [ ] Loader
    - [ ] Unveiler
        - [ ] DOM declaration
        - [ ] unveiled class
    - [ ] Strings
        - [ ] Bug `convert_case` with `dashed`
    - [ ] Time / Date
        - [ ] Formater (custom formats (sprinf like))
        - [ ] Local
- [ ] Classes (update)
    - [ ] Ticker
        - [ ] :warning: Stop ticker if window blur
    - [ ] Detector
        - [ ] :warning: `add_detector` method
    - [ ] Breakpoints
        - [ ] :warning: Add classes to elements/selectors in options
    - [ ] Resizer
        - [ ] :warning: Add `none` in rounding
    - [ ] Keyboard
        - [ ] :warning: Event listening for specified key (ex: `on('cmd+c')`)
        - [ ] :warning: Character to keycode
    - [ ] Event_Emitter
        - [ ] Deferred trigger (can specify event)
    - [ ] Better Match media
        - [ ] Multiple matches
        - [ ] Fallback for width and height
    - [ ] GA Tags
        - [ ] Dynamically add GA script with method "init( ua_code )"
            - [ ] Trigger event
    - [ ] Mouse
        - [ ] Wheel type detection
    - [ ] Colors
        - [ ] Better param names (input/output)
        - [ ] Better gradient (multiple steps)
        - [ ] Only one convertissor method (default any => rgb)
        - [ ] Use Strings Tool
        - [ ] Darken method
        - [ ] Merge method
        - [ ] Color as component
    - [ ] Registry
        - [ ] Persistence (localstorage / cookie fallback)


## Changelog

#### 0.2.0 (2015-11-14)

- Replace `init` by `construct`
- Add `$` property on Abstract
- Add `b-` to default classes
- Fix `null` option bug
- Add license
- Add no polyfills builds
- Add information on top of builds
- Update structure with better scope and general `'use strict'`
- Add Konami Code class
- Add Strings class
- Add autosave in registry on Abstract
- Split Browser class into Viewport, Breakpoints and Detector classes
- Add trigger order to Viewport
- Add `match_breakpoint` to Viewport
- Fix `no-features` classes not working on Detector
- Fix initial trigger on Breakpoints when no breakpoint active
- Add DOM Element support for Detector css classes targets
- Add events on Registry
- Add `format` parameter on  `get_sizes` method (support "cartesian", "css" or "both")
- Add throttle by only specifying event like on('tick-250') for 250 ms
- Add `wait` method


#### 0.1.0 (2015-03-10)

Init


