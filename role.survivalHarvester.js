// Harvester to be used in survival situation of 0 creeps alive and minimum energy available.
// Its job is to harvest energy and fill extensions and spawn during its lifetime

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            
            const structureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE];
            
            // storages have storage, not energy capacity, hence the additional check in the filter
            // filter says (if the structure is any of the types in the array above) AND (  (the storage is less than max) OR (the energy is less than the energy capacity)  )
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => structureTypes.includes(s.structureType) && ((s.store && s.store.getFreeCapacity()) || (s.energyCapacity && s.energy < s.energyCapacity)), ignoreCreeps: true
            }); 

            // if we found one
            if (structure != undefined) { console.log("2");
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if spawn, towers, and extensions are full, then go upgrade controller
            else { console.log("3");
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
                }
            }
            
         }
        // if creep is supposed to harvest energy from source
        else { console.log("4");
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
        }
    }
};