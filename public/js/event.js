function EventC() {
    this.listeners = []
}

EventC.prototype = {
    register(fn) {
        this.listeners.push(fn)
    },
    notifyAll() {
        for (var listener of this.listeners) {
            listener.apply(this, arguments)
        }
    }
}

if (typeof window === "undefined") {
    module.exports = EventC
}