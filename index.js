let pending = 1,
    fullfilled = 2,
    rejected = 3

function MyPromise(entryFunc) {

    this.laterPromises = []
    this.value = undefined
    this.state = pending
    entryFunc(this.resolve.bind(this), this.reject.bind(this))


}

MyPromise.prototype.resolve = function (result) {
    if (result instanceof MyPromise) {

        result.then(this.reject.bind(this), this.reject.bind(this))
    } else {

        this.fullfill(result)
    }

}
MyPromise.prototype.fullfill = function (value) {
    if (this.state != pending) return
    this.state = fullfilled
    this.kickOff(value)
}
MyPromise.prototype.then = function (onFullfilled, onRejected) {
    const p = new MyPromise(function () {})
    p.onFullfilled = onFullfilled
    p.onRejected = onRejected

    this.laterPromises.push(p)

    return p

}
MyPromise.prototype.kickOff = function (value) {
    if (this.state === pending) return
    const thisPromise = this;
    setTimeout(function () {
        thisPromise.laterPromises.forEach(function (laterPromise) {

            try {
                const m = thisPromise.state === fullfilled ? 'onFullfilled' : 'onRejected'
                const m2 = thisPromise.state === fullfilled ? 'resolve' : 'reject'

                laterPromise[m2](laterPromise[m](value))

            } catch (e) {
                laterPromise.reject(e)

            }


        })
        thisPromise.laterPromises = null;
    })




}


MyPromise.prototype.reject = function (reason) {
    if (this.state != pending) return
    this.state = rejected
    this.kickOff(reason)

}


//my promise


var myp = new MyPromise(function (rs, rj) {
    setTimeout(function () {
        rs(2);
        console.log('resolved')
    }, 2000)
}).then(function (r) {
    console.log(`result is ${r}`)
    1/0
}).then(function (r) {
    console.log(r)
}, function (r) {
    console.log(r)
    console.log('error')
})
