module.exports = {

    saystuff() {
        console.log("hello")
    },

    saystuff2() {
        console.log("hello2");
    },
    
    deleteDeadCreepsMemories() {

        for (let name in Memory.creeps) {
            // and checking if the creep is still alive
            if (Game.creeps[name] == undefined) {
                // if not, delete the memory entry
                delete Memory.creeps[name];
            }
        }

    }
};
