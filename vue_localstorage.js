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
        var storedData = this.data
        let result = storedData[key]
        if (result === undefined) {
            return 0
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
        var storedData = this.data
        let result = this._getValueForOperation(key)
        storedData[key] = result += 1
        this._save(storedData)
    }

    decrement(key) {
        // NEW
        var storedData = this.data
        let result = this._getValueForOperation(key)
        storedData[key] = result += 1
        this._save(storedData)
    }

    incrementBy(key, k=1) {
        // NEW
        var storedData = this.data
        let result = this._getValueForOperation(key)
        storedData[key] = result += k
        this._save(storedData)
    }

    decrementBy(key, k=1) {
        // NEW
        var storedData = this.data
        let result = this._getValueForOperation(key)
        storedData[key] = result -= k
        this._save(storedData)
    }

    listPush(key, value) {
        // NEW
        var storedData = this.data
        let result = this._getList(key)
        result.push(value)
        storedData[key] = result
        this._save(storedData)
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
        var result = this.data
        delete result[key]
        this._save(result)
    }

    save(key, value) {
        this.storage.setItem(key, value)
    }

    getValue(key) {
        return this.storage.getItem(key)
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