/**
 * @class    Router
 * @author   trstn
 * @requires history.js
 */

( function()
{
    'use strict';

    B.Tools.Router = B.Core.Event_Emitter.extend(
    {
        static  : 'router',
        options : {},

        construct : function( options )
        {
            this._super( options );
            this.routes = {};
            this.listen();
        },

        /**
         * add route
         * @param {string}   path  target url
         * @param {function} fn    callback function
         */
        add : function(path, fn)
        {
            var controller = this.getController(path);
            var keys = this.getKeys(path);
            this.routes[path] = {path: path, controller : controller, keys: keys, fn : fn};
        },

        /**
         * remove route
         * @param {string} path remove url
         */
        remove : function(path)
        {
            delete this.routes[path];
        },

        /**
         * change browser state
         * @param {string} url target path
         */
        navigate :  function(url)
        {
            History.pushState(null, null, url);
        },

        /**
         * add listener for check browser state
         */
        listen : function()
        {
            var that = this;
            History.Adapter.bind(window,'statechange',function(){
                var State = History.getState();
                that.urlMatch(State.hash);
                that.trigger('change_page', []);
            });
        },

        /**
         * convert url to an object, helpful for matching route and url
         * @return {object} obj
         */
        urlToObj : function(url)
        {
            var that = this;
            var keys = url.split('/').splice(1);
            var obj = {};

            for(var elt in this.routes)
            {
                var route = that.routes[elt];
                //verify if url and route have same controller and same count of variables
                if(keys[0] == route.controller && (keys.length - 1) == Object.keys(route.keys).length)
                {
                    obj = {
                        path : route.path,
                        controller : route.controller,
                        keys : {},
                        fn : route.fn,
                    }
                    var i = 1;
                    for(var elt in route.keys)
                    {
                        obj.keys[elt] = keys[i];
                        i++;
                    }
                }
            }
            return obj;
        },

        /**
         * get controller in path url
         * @param  {string} url target path
         * @return {string}
         */
        getController : function(path)
        {
            return path.split('/')[1];
        },

        /**
         * get keys in path url
         * @param  {string} url target path
         * @return {Objet} keys
         */
        getKeys : function(path)
        {
            var keys = {};
            var first = true;
            path.split('/:').forEach(function(elt){
                if(!first)
                    keys[elt] = elt;
                else
                    first= false;
            });
            return keys;
        },

        /**
         * verify if url is registered and apply call callback function
         * @param  {string} url target path
         */
        urlMatch : function(url)
        {
            var obj = this.urlToObj(url);
            var el = this.routes[obj.path];

            if(el && el.fn)
            {
                el.fn.apply(obj);
            }
        }


    } );
} )();
