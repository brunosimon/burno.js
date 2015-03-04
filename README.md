Burno.js
========

#### Yet another JS framework ####

Burno.js (or **B.js**) is a light (**< 40ko**) and simple **JS framework** I made and used on many website I developed.
Because Internet is a place of love and sharing, here it is.

With B.js, you can organize your web application into **Components** and **Tools**. It comes with some useful premade tools like "Browser", "Mouse", "Keyboard", "Resizer".
Simply include the JS files in your HTML and start using it.

B.js is still in development.


## Compatibility

B.js has no dependencies (because who need jQuery today?).
It's compatible with all modern browsers down to IE8 (included)
Depending on the browsers and classes you are using, you may need the polyfills which are included on the src/polyfills folder.


## Usage

There is two ways of using B.js.
You can use it as a simple library by instantiating the Tools or you can use it as a Framework by developing your App and Components by extending B.js

#### As a library (the easy way)

* Include the build in your HTML
* Instantiate the tools you need
* Start using them (see below what each tool can do)

```html
<script src="../../build/burno-0.1.min.js"></script>
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
<script src="../../build/burno-0.1.min.js"></script>
<script>



</script>
```

## Core classes

#### Abstract

* Options (merging)
* Init (always called)
* For simple object
* Static / Singleton
* JS to include
* example


#### Event Emitter

* For object that need to fire events and to be listen
* Inherit from abstract
* On
* Off
* Trigger (can ise 'fire')
* Flags / Tags (?)
* Transformation on event names
* JS to include
* example


## Tools

* Singleton
* Create your own (can inherit)

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


