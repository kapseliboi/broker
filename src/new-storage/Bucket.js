const createDebug = require('debug')

class Bucket {
    constructor(id, streamId, partition, size, records, dateCreate, maxSize, maxRecords, keepAlive = 5) {
        this.id = id
        this.streamId = streamId
        this.partition = partition
        this.size = size
        this.records = records
        this.dateCreate = dateCreate

        this.debug = createDebug(`streamr:storage:bucket:${this.id}`)

        this._maxSize = maxSize
        this._maxRecords = maxRecords
        this._keepAlive = keepAlive

        this.ttl = new Date()
    }

    isFull() {
        const isFull = this.size >= this._maxSize || this.records >= this._maxRecords
        this.debug(`isFull: ${isFull} => ${this.size} >= ${this._maxSize} || ${this.records} >= ${this._maxRecords}`)
        return isFull
    }

    getId() {
        return this.id
    }

    incrementBucket(size, records = 1) {
        this.size += size
        this.records += records

        this.debug(`incremented bucket => size: ${this.size}, records: ${this.records}`)
        this._updateTTL()
    }

    _updateTTL() {
        this.ttl.setMinutes(this.ttl.getMinutes() + this._keepAlive)
        this.debug(`new ttl: ${this.ttl}`)
    }

    isAlive() {
        const isAlive = new Date() > this.ttl
        this.debug(`isAlive: ${isAlive}`)
        return new Date() > this.ttl
    }
}

module.exports = Bucket
