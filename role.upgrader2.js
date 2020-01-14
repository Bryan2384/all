var C = require ('constants');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep's energy is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep's energy is full, upgrade controller
        if (creep.memory.working == true) {
            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        
        // if creep is supposed to get energy....
        else {
            
            // reference room's storage object
            var structure = creep.room.storage;
            
            // if creep is supposed to get energy, and storage has more than 250k energy, take from it
            if (structure.store.getUsedCapacity() > C.STORAGE_ENERGY_LEVEL_1) {
                if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if storage has less than 250k, go to container, take from it
            else {
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= 0, ignoreCreeps: true
            });
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                    }
                }
            }
        }
    }
};