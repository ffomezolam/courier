/**
 * An observer-notifier class
 *
 * @module courier
 * @author Andrew Malozemoff
 *
 * @requires Silverlight wmvplayer
 */
(function(name, context, definition) {
    if(typeof module !== 'undefined' && module.exports) module.exports = definition();
    else if(typeof define ==='function' && define.amd) define(definition);
    else context[name] = definition();
})('Courier', this, function() {
    // allow console use
    window.console = window.console || { log: function() {} };

    var couriers = {};

    var isCourier = function(o) { 
        if(o.toString().toLowerCase() === '[object object]') return true;
        return false;
    };

    /**
     * Courier class, with silly rpg-style method names to
     * obfuscate understanding of the code.
     *
     * @class Courier
     * @constructor
     * @param {String} name Courier name
     * @returns {Courier} A new or existing courier
     */
    function Courier(name) {
        if(typeof name !== 'string' || !name) return null;
        if(couriers[name]) return couriers[name];

        couriers[name] = this;
        this.name = name;
        this.routes = {};
    }

    /**
     * List of instantiated Couriers
     *
     * @property couriers
     * @type Object
     * @static
     * @private
     */
    Courier.couriers = couriers;

    /**
     * Train a Courier
     *
     * @method train
     * @static
     * @param {String} name Courier name
     * @returns {Courier} The Courier object
     */
    Courier.train = function(name) {
        if(!couriers[name]) couriers[name] = new Courier(name);
        return couriers[name];
    };

    /**
     * Get a Courier
     *
     * @method hire
     * @static
     * @param {String} name Courier name
     * @returns {Courier} The Courier
     */
    Courier.hire = function(name) {
        return couriers[name] || null;
    };

    Courier.prototype = {
        /**
         * Schedule a route for the Courier
         *
         * @method schedule
         * @chainable
         * @param {String} name Route name
         * @param {Function} method Route destination
         * @param {Object} [context] Destination context
         * @return {Courier} This Courier
         */
        schedule: function(name, method, context) {
            if(!name) return this;
            if(!this.routes[name]) this.routes[name] = [];
            if(method) this.routes[name].push({ method: method, context: context || null });
            return this;
        },

        /**
         * Cancel a route
         *
         * @method cancel
         * @chainable
         * @param {String} name Route name
         * @param {Function} [method] Route destination
         * @param {Object} [context] Destination context
         * @return {Courier} This Courier
         */
        cancel: function(name, method, context) {
            if(!name || !this.routes[name]) return this;
            if(!context) context = null;
            var route = this.routes[name];
            for(var l = route.length, r = l - 1; r >= 0; r--) {
                if(!method || (route[r].method === method && route[r].context === context)) {
                    route.splice(r, 1);
                    return this;
                }
            }
            return this;
        },

        /**
         * Deliver the goods
         *
         * @method deliver
         * @chainable
         * @param {String} name Route name
         * @param {anything} [arguments]* The goods
         * @return {Courier} This Courier
         */
        deliver: function(name /* arguments */) {
            if(!name || !this.routes[name]) return this;
            var args = Array.prototype.slice.call(arguments, 1);
            var route = this.routes[name];
            for(var i = 0; i < route.length; i++) {
                route[i].method.apply(route[i].context, args);
            }
            return this;
        }
    };

    return Courier;
});
