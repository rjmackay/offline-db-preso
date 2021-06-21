const kappa = require('kappa-core');
const ram = require('random-access-memory');

// Create a kappa instance. 
const core = kappa(ram, { valueEncoding: "json" });
// Get a write feed
core.writer("local", async function (err, feed) {
    // Add a todo to our log
    const todo = { id: 1, text: "Do the thing!", done: false };
    feed.append({
        type: 'put',
        ...todo
    });

    feed.get(0, (err, data) => {
        console.log(data);
    });
});

