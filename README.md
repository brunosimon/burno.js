Burno.js
========

#### Yet another JS framework ####

Burno.js (or **B.js**) is a light (**< 40ko**) and simple **JS framework** made to help you develop well structured web application quickly.
Because Internet is a place of love and sharing, here it is.

You can organize your web application into **Components** and **Tools**. It comes with some useful premade [tools](#tools).
Simply include the JS files in your HTML and start using it.

B.js is still in development, don't hesitate if you have any advice.


## Compatibility

B.js has no dependencies (because who need jQuery today?).
It's compatible with all modern browsers down to IE8 (included)
Depending on the browsers and classes you are using, you may need polyfills which are included in the src/polyfills folder.


## Usage

There is two ways of using B.js.
You can use it as a simple library by instantiating the Tools or you can use it as a Framework by developing your web application and its Components by extending B.js

#### As a library (the easy way)

* Include the build in your HTML
* Instantiate the tools you need
* Start using them (see below what each tool can do)

```html
<!-- B.js -->
<script src="../../build/burno-0.1.min.js"></script>

<!-- Your script -->
<script>

    var browser = new B.Tools.Browser();

    browser.on( 'resize', function( viewport )
    {
        console.log( 'viewport height ', viewport.height );
    } );

</script>
```

#### As a framework (the powerful way)

Create your own classes based on B.js classes and organize your web application into Components. You can organize all your components inside `B.Components` object or you can improve the namespace like `B.Components.Foo.Bar`.
Inheritance is based on the [John Resig code](http://ejohn.org/blog/simple-javascript-inheritance/) with some improvements like deep property merging.
B.js is developed in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). Do as you whish and feel free to share your custom Tools and Components.

* Include the build in your HTML
* Create your own Tools and Components based on Burno classes **Abstract** or **Event Emitter** (you may want to create put each class in a different file)

```html
<!-- B.js -->
<script src="../../build/burno-0.1.min.js"></script>

<!-- Your classes -->
<script>

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

</script>

<!-- Your script -->
<script>

    // Let's rock
    var my_app = new B.Components.My_App();

</script>
```

## Core classes

Core classes are based classes you want to inherite if your building custom Components and Tools.

#### Abstract Class

`B.Core.Abstract` is the default class you can inherit.

* Construct method
* Static / Singleton
* Deep options merging


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
// Currently, static functionnality is only used for tools but it's just a namespace. Do what ever you want.
B.Tools.Custom_Class = B.Core.Event_Emitter.extend(
{
    // Chose a name never used
    static : 'custom_tool',

    init : function()
    {
        console.log( 'Init' );
    }
} );

// 'custom_tool' and 'custom_tool_again' will share the same instance
// 'init' will be called only the first time
var custom_class       = new B.Tools.Custom_Class(),
    custom_class_again = new B.Tools.Custom_Class();
```


#### Event Emitter Class

`B.Core.Event_Emitter` inherit from `B.Core.Abstract` with extra event methods (**on**, **off**, **trigger**).

* Normalize event names (*event-name* == *eventname* == *event_name*)
* Event parameters
* Namespace
* on()
* off()
* trigger()

###### Default example
```javascript

```

###### Namespace example
```javascript

```

## Tools

B.js comes with some premade Tools. Each one is a singleton (static). You can instantiate it multiple times, you will always get the first instance.

You can inherit from those tools if you want.

### Browser

**Options**
```javascript
{
    disable_hover_on_scroll : true,       // Improve performance when scrolling but disable hovers
    initial_trigger         : true,       // Trigger 'scroll' and 'resize' events on the next frame
    add_classes_to          : [ 'html' ], // Add detect informations to selectors in array
    breakpoints             : []          // Breakpoints
}
```

**Properties**
* viewport
* detect

**Methods**
* match_media

**Events**
* resize
* scroll
* breakpoint

* Classes
* Breakpoints
* Disable hover on scroll
* Match media

### Colors

* Options
* Any string to RGB
* Conversions
* Get steps colors
* Parse for steps colors

### GA Tags

* Options
* Parser
* Send
* Unique
* Add GA
* Events

### Keyboard

* Options
* Are down / Is down
* Events

### Mouse

* Options
* Events
* Wheel type detection

### Ticker

* Options
* Start (set time data to 0)
* Run (raf)
* Tick
* Do next
* Events

### Registery

* Options
* Use as cache
* Set
* Get

### CSS

* Options
* Apply

### Resizer

* Options
* Get sizes
* Resize
* Parse
* Auto resize (browser resize event)

## Todo


## ChangeLog


