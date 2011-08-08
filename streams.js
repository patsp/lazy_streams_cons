// construct a new cell (object with "car" and "cdr")
// containing given car as "car" and cdr as "cdr"
var cons = function (car, cdr) {
    return {
        "car": car,
        "cdr": cdr,
        "toString": function () {
            return "(" + this.car + " . " +
                (cdr ? cdr.toString() : "nil") + ")";
        }
    };
};

console.log(cons(1, cons(2, null)).toString());

// delay the call to f with the given arguments until it is force()d
// i.e.: simply return a function which calls f
var delay = function (f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        return f.apply(null, args);
    };
};

var force = function (delayed) {
    return delayed();
};

var delayed = delay(function (x) {
    console.log(x);
}, 5);
force(delayed);

var streamCons = function (car, cdr) {
    return cons(car, delay(cdr));
};

var streamCar = function (cell) {
    return cell.car;
};

var streamCdr = function (cell) {
    return force(cell.cdr);
};

var map = function (f, list) {
    if (!list) return null;
    return cons(f(list.car), delay(map, f, list.cdr));
};

var streamTake = function (n, list) {
    if (n == 0 || !list) return null;
    return cons(list.car, streamTake(n - 1, streamCdr(list)));
}

var iterate = function (init, f) {
    return cons(init, delay(iterate, f(init), f));
};

console.log(streamTake(10, iterate(0, function (x) {
    return x + 1;
})).toString());

var ones = function () {
    return cons(1, delay(ones));
};

console.log(streamTake(10, ones()).toString());

