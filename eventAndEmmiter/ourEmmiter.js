function Emmiter() {
    this.events = {};
}

Emmiter.prototype.on = function(type,listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
}

Emmiter.prototype.emit = function(type) {
    if(this.events[type]) {
        this.events[type].forEach(listener=>{
            listener();
        })
    }
}

module.exports = Emmiter;