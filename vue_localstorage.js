class VueLocalStorage {
    constructor() {
        this.DEFAULT_KEY_NAME = 'vue_local'
        this.storage = localStorage
    }

    get data() {
        var result = JSON.parse(this.storage.getItem(this.DEFAULT_KEY_NAME))

        if (!result) {
            this._save({})
            return {}
        } else {
            return result
        }
    }

    _save(data) {
        // Saves an element under the global session key
        this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(data))
    }

    _getValueForOperation(key) {
        // NEW: Return the numeric value stored under a key
        // to run a given operation
        // var storedData = this.data
        // let result = storedData[key]
        const result = this.retrieve(key)

        if (result === undefined) {
            return 0
        }

        if (typeof result !== 'number') {
            throw new Error('Value for increment or decrement operation should be a number')
        }
        return result
    }

    _getList(key) {
        // NEW: Returns the value of the key if the
        // item is Array otherwise raises an error
        var storedData = this.data
        let result = storedData[key]
        if (!Array.isArray(result)) {
            throw new Error('Object is not an array')
        }
        return result
    }

    retrieve(key) {
        return this.data[key]
    }

    create(key, value) {
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
    }

    exists(key) {
        // NEW
        const storedData = this.data
        return Object.keys(storedData).includes(key)
    }

    getDelete(key) {
        // NEW
        let returnValue
        var storedData = this.data

        returnValue = storedData[key]
        delete storedData[key]

        this._save(storedData)
        return returnValue
    }

    increment(key) {
        // NEW
        // var storedData = this.data
        // let result = this._getValueForOperation(key)
        // storedData[key] = result += 1
        // this._save(storedData)
        let result = this._getValueForOperation(key)
        result = result += k
        this.create(key, result)
    }

    decrement(key) {
        // NEW
        // var storedData = this.data
        // let result = this._getValueForOperation(key)
        // storedData[key] = result += 1
        // this._save(storedData)
        let result = this._getValueForOperation(key)
        result = result -= k
        this.create(key, result)
    }

    incrementBy(key, k = 1) {
        // NEW
        // var storedData = this.data
        // let result = this._getValueForOperation(key)
        // storedData[key] = result += k
        // this._save(storedData)
        let result = this._getValueForOperation(key)
        result = result += k
        this.create(key, result)
    }

    decrementBy(key, k = 1) {
        // NEW
        // var storedData = this.data
        // let result = this._getValueForOperation(key)
        // storedData[key] = result -= k
        // this._save(storedData)
        let result = this._getValueForOperation(key)
        result = result -= k
        this.create(key, result)
    }

    getOrCreate(key, value) {
        // NEW
        // var storedData = this.data
        // let result = storedData[key]
        // if (!result) {
        //     // storedData[key] = value
        //     // this._save(storedData)
        //     this.create(key, value)
        // } else {
        //     return result
        // }
        const result = this.exists(key)
        let returnValue = null
        let returnArray
        if (result) {
            returnValue = this.retrieve(key)
            returnArray = [false, returnValue]
        } else {
            this.create(key, value)
            returnValue = value
            returnArray = [true, returnValue]
        }
        return returnArray
    }

    listPush(key, value) {
        // NEW
        // var storedData = this.data
        // let result = this._getList(key)
        // result.push(value)
        // storedData[key] = result
        // this._save(storedData)
        let result = this._getList(key)
        result.push(value)
        this.create(key, result)
    }

    // listFilter(key, value) {
    //     // NEW
    //     const result = this._getList(key)
    //     return result.filter((item) => {
    //         let truthArray = [
    //             item.includes(value),
    //             item === value
    //         ]
    //         return truthArray.some(x => x === true)
    //     })
    // }

    listMerge(key, values) {
        // NEW
        // let newList
        // var storedData = this.data
        // const result = this._getList(key)

        // if (!Array.isArray(values)) {
        //     throw new Error('Is not an array')
        // }

        // newList = [...result, ...values]
        // storedData[key] = newList
        // this._save(storedData)
        let newList
        const result = this._getList(key)

        if (!Array.isArray(values)) {
            throw new Error('Is not an array')
        }

        newList = [...result, ...values]
        this.create(key, newList)
    }

    listCount(key) {
        // NEW
        const result = this._getList(key)
        return result.length
    }

    toggle(key) {
        // NEW
        // var storedData = this.data
        // let result = storedData[key]
        // if (typeof result === 'boolean') {
        //     storedData[key] = !storedData[key]
        // } else {
        //     storedData[key] = true
        // }
        // this._save(storedData)
        var result = this.retrieve(key)
        if (typeof result === 'boolean') {
            this.create(key, !result)
        } else {
            this.create(key, true)
        }
    }

    // createExpiry(key, value) {
    //     // NEW: Create a key constrained to
    //     // an expiry date
    //     let d = Date.now()
    //     let base64Date = btoa(d)

    //     var storedData = this.data
    //     storedData[key] = value

    //     let expirations = storedData.exp || {}
    //     expirations[key] = base64Date
    //     storedData.exp = expirations

    //     this._save(storedData)
    // }

    remove(key) {
        var storedData = this.data
        delete storedData[key]
        this._save(storedData)
    }

    save(key, value) {
        this.storage.setItem(key, value)
    }

    install(app) {
        app.config.globalProperties.$localstorage = this
        app.mixin({
            data: () => ({
                localStorage: this.data
            })
        })

        // setupDevtools(app, this)
        // // app.provide(storageSymbol, this)
        // app.config.globalProperties.$localstorage = this
        // app.mixin({
        //     data: () => ({
        //         localStorage: this.data
        //     })
        // })

        window.$VueLocalStorage = this
        // if (DEBUG) {
        // }
    }
}

function createLocalStorage() {
    return new VueLocalStorage()
}
