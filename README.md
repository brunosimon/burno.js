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
* Create your own Tools and Components based on Burno classes **Abstract** or **Event Emitter**

```html
<!-- B.js -->
<script src="../../build/burno-0.1.min.js"></script>

<!-- Your classes -->
<script>

    // Create a class wrapping the all application
    B.Components.My_App = B.Core.Abstract.extend(
    {
        // No default options
        options : {},

        init : function( options )
        {
            this._super( options );

            // Instantiate a sidebar with blue color
            this.sidebar = new B.Components.My_Sidebar( {
                colors :
                {
                    title : 'red'
                }
            } );

            // Listen to activate and deactivate events
            this.sidebar.on( 'activate deactivate', function( status )
            {
                console.log( 'sidebar active :', status );
            } );
        }
    } );

    // Create a  class for the sidebar
    B.Components.My_Sidebar = B.Core.Event_Emitter.extend(
    {
        // Default options
        options :
        {
            colors :
            {
                title      : 'blue',
                background : '#ccc'
            }
        },

        init : function( options )
        {
            this._super( options );

            // Set variables
            this.main     = document.querySelector( 'aside' );
            this.title    = this.main.querySelector( '.title' );
            this.active   = this.main.classList.contains( 'active' );
            this.keyboard = new B.Tools.Keyboard();

            // Update style
            this.main.style.backgroundColor = this.options.colors.background;
            this.title.style.color          = this.options.colors.title;

            // Listen to keyboard 'down' event
            var that = this;
            this.keyboard.on( 'down', function( keycode, caracter )
            {
                // Test if key down is the 'space' key
                if( caracter === 'space' )
                {
                    // Toggle the sidebar
                    that.toggle();

                    // Prevent default keyboard event
                    return false;
                }
            } );
        },

        // Toggle method (simply call activate or deactivate methods)
        toggle : function()
        {
            if( this.active )
                this.deactivate();
            else
                this.activate();
        },

        // Activate method
        activate : function()
        {
            // inactive
            if( this.active )
                return;

            // Update sidebar
            this.main.classList.add( 'active' );
            this.active = true;

            // Fire 'activate' event
            this.trigger( 'activate', [ this.active ] );
        },

        // Deactivate method
        deactivate : function()
        {
            // Already inactive
            if( !this.active )
                return;

            // Update sidebar
            this.main.classList.remove( 'active' );
            this.active = false;

            // Fire 'deactivate' event
            this.trigger( 'deactivate', [ this.active ] );
        }
    } );

</script>

<!-- Your script -->
<script>

    // Let's rock
    var my_app = new B.Components.My_App({});

</script>
```

## Core classes

Core classes are based classes you want to inherite if your building custom Components and Tools.

#### Abstract

`B.Core.Abstract` is the default class you can inherit.

* Construct method
* Static / Singleton
* Deep options merging


###### Default example
```javascript
B.Components.Custom_Class = B.Core.Abstract.extend(
{
    init : function()
    {
        console.log( 'Welcome to my custom class' );
    }
} );

var custom_class = new B.Components.Custom_Class();
```

###### Options with deep merging example
```javascript
B.Components.Custom_Class = B.Core.Abstract.extend(
{
    options :
    {
        test :
        {
            foo   : 'bar',
            lorem : 'ipsum'
        }
    },

    init : function( options )
    {
        this._super( options );

        console.log( 'See my custom class options', this.options );
    }
} );

var custom_class = new B.Components.Custom_Class( {
    test :
    {
        lorem : 'dolores'
    }
} );
```

###### Options with static
```javascript

```


#### Event Emitter

`B.Core.Event_Emitter` inherit from `B.Core.Abstract` and add some event methods (**on**, **off**, **trigger**).

* Normalize event names
* Event parameters
* Namespace
* On()
* Off()
* Trigger()

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

* Options
* Viewport
* Detection (user agent, no plateform (emulation), browser, engine, system (messy), features (touch))
* Classes
* Breakpoints
* Disable hover on scroll
* Match media
* Events

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


