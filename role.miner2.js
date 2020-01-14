module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        //find a container that has room for energy
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
        
        //if it can find a container that has space...
        if (targets != undefined) {
            //if further than 0 from the container
            if(targets.length > 0) {
                //if the creeps is right on the container, then harvest source, and due to lack of CARRY part, energy will drop in container
                if (creep.pos.getRangeTo(targets[1]) == 0) {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES, {ignoreCreeps: true});
                    creep.harvest(source);
                }
                //else move to the container
                else {
                    creep.moveTo(targets[1]);
                }    
            }
        }
    }
};
