(function () {
    'use strict';

    var cons, streamCons, streamCar, emptyStream,
        streamCdr, streamTake, streamMap,
        iterate, ones;

    // construct a new cell (object with "car" and "cdr")
    // containing given car as "car" and cdr as "cdr"
    cons = function (car, cdr) {
        var toString;

        // note that toString doesn't use this.car
        // or this.cdr, so the list is immutable
        toString = function () {
            return "(" + car + " . " +
                (cdr ? cdr.toString() : "nil") + ")";
        };

        return {
            car: car,
            cdr: cdr,
            toString: toString
        };
    };

    // delay and force should only be used
    // by streamCons and streamCdr, streamCar, emptyStream
    (function () {
        var delay, force;

        // delay the call to f with the given arguments until it is force()d
    // i.e.: simply return a function which calls f
        delay = function (f) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return f.apply(null, args);
            };
        };

        force = function (delayed) {
            return delayed();
        };

        streamCons = function (car, cdr) {
            return cons(car, delay(cdr));
        };

        streamCar = function (cell) {
            return cell.car;
        };

        streamCdr = function (cell) {
            return force(cell.cdr);
        };

        emptyStream = null;
    }());

    streamMap = function (f, list) {
        if (list === emptyStream) {
            return emptyStream;
        }
        return streamCons(f(streamCar(list)), function () {
            return streamMap(f, streamCdr(list));
        });
    };

    streamTake = function (n, list) {
        if (n === 0 || list === emptyStream) {
            return emptyStream;
        }
        return cons(list.car, streamTake(n - 1, streamCdr(list)));
    };

    iterate = function (init, f) {
        return streamCons(init, function () {
            return iterate(f(init), f);
        });
    };

    ones = function () {
        return streamCons(1, ones);
    };

    // ------ some tests

    console.log(cons(1, cons(2, emptyStream)).toString());

    console.log(streamTake(10, iterate(0, function (x) {
        return x + 1;
    })).toString());

    console.log(streamTake(10, ones()).toString());

    console.log(streamTake(10, streamMap(function (x) {
        return x + 1;
    }, ones())).toString());

    //----------

}());