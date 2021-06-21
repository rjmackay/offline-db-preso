const kappa = require('kappa-core');
const ram = require('random-access-memory');
const recordView = require('./record-view');
const level = require('level-mem');

// Create a kappa instance. 
const core = kappa(ram, { valueEncoding: "json" });
core.use('records', recordView(level({ valueEncoding: "json" })))
// Get a write feed
core.writer("local", async function (err, feed) {
    // Add a todo to our log
    const todo1 = { id: 1, text: "Do the thing!", done: false };
    const todo2 = { id: 2, text: "Do more!", done: false };
    feed.append({
        type: 'put',
        ...todo1
    });
    feed.append({
        type: 'put',
        ...todo2
    });
    feed.append({
        type: 'del',
        ...todo1
    });
    feed.append({
        type: 'put',
        ...todo2,
        done: true
    });
});

core.ready([], function () {
    core.api.records.all(function (data) {
        console.log(data);
    })
})

