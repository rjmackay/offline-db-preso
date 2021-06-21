const kappa = require('kappa-core')
const ram = require('random-access-memory')
const crypto = require('crypto');
const hyperswarm = require('hyperswarm')
const pump = require('pump')
const recordView = require('./record-view');
const level = require('level-mem');

const topic = crypto.createHash('sha256').update('jsconf-todos').digest()
const swarm = hyperswarm()

const core = kappa(ram, { valueEncoding: 'json' })
core.use('records', recordView(level({ valueEncoding: "json" })))
core.writer('local', function (err, feed) {
    swarm.join(topic, { lookup: true, announce: true })
    swarm.on('connection', function (connection, info) {
        console.log("New peer!")
        pump(connection, core.replicate(info.client, { live: true }), connection)
    });

    process.stdin.on('data', function (data) {
        feed.append({
            type: 'put',
            text: data.toString().trim(),
            id: Date.now(),
            done: false
        })
    })
})

core.ready([], function () {
    // Get latest 10 messages
    core.api.records.all(function (data) {
        for (let msg of data.reverse()) {
            console.log(msg)
        }
    })
    // Listen for latest message. 
    core.api.records.on('batch', function (data) {
        for (let msg of data) {
            console.log(msg)
        }
    });
})
