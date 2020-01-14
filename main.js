// REQUIRES ////////////////////////////////////////
const C = require ('constants');

// static mining roles
const roleMiner = require ('role.miner');
const roleMiner2 = require ('role.miner2');
const roleDistributor = require('role.distributor');
const roleUpgrader2 = require('role.upgrader2');
const roleBuilder2 = require('role.builder2');
const roleRepairer2 = require ('role.repairer2');

// non-static modules
const roleBuilder = require ('role.builder');
const roleRepairer = require ('role.repairer');

const util = require ('utilities');

// survival mode roles
const roleSurvivalHarvester = require ('role.survivalHarvester');
////////////////////////////////////////////////////

module.exports.loop = function () {
  
    //saystuff();

    // delete any memory entries of any dead creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    
    // assign modules depending on role
    for (let name in Game.creeps) {
        
        // get the creep object
        var creep = Game.creeps[name];
        
        // static mining roles /////////////////////
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'miner2') {
            roleMiner2.run(creep);
        }
        else if (creep.memory.role == 'distributor') {
            roleDistributor.run(creep);
        }
        else if (creep.memory.role == 'upgrader2') {
            roleUpgrader2.run(creep);
        }
        else if (creep.memory.role == 'builder2') {
            roleBuilder2.run(creep);
        }
        else if (creep.memory.role == 'repairer2') {
            roleRepairer2.run(creep);
        }
        
        // non-static mining roles /////////////////////
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        
        // survival mode roles /////////////////////
        else if (creep.memory.role == 'survivalHarvester') {
            roleSurvivalHarvester.run(creep);
        }
    }
    
    // SPAWN LOGIC //////////////////////////////////////////////////////////////////////////////
    
    // get existing number of creeps and their roles
    var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
    var numberOfMiners2 = _.sum(Game.creeps, (c) => c.memory.role == 'miner2');
    var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor');
    var numberOfUpgraders2 = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader2');
    var numberOfBuilders2 = _.sum(Game.creeps, (c) => c.memory.role == 'builder2');
    var numberOfRepairers2 = _.sum(Game.creeps, (c) => c.memory.role == 'repairer2');
    
    var name = undefined;
    
    // Spawn survivalHarvester if all creeps are dead
    if (Object.keys(Game.creeps).length === 0) {
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], undefined, { 
                role: 'survivalHarvester', working: false});
    }
    
    // Spawn creeps if population is under 9 OR if any creep role has 0 creeps active
    if (Object.keys(Game.creeps).length < C.MAX_POPULATIO || numberOfMiners === 0 || numberOfMiners2 === 0 || numberOfDistributors === 0 || numberOfUpgraders2 === 0 || numberOfBuilders2 === 0 || numberOfRepairers2 === 0) {
        
        // if not enough miners, spawn one
        if (numberOfMiners < C.MIN_NUMBER_OF_MINERS) {
            name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, { 
                role: 'miner', working: false});
        }
        else if (numberOfMiners2 < C.MIN_NUMBER_OF_MINERS2) {
            name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, { 
                role: 'miner2', working: false});
        }
        // if not enough distributors, spawn one
        else if (numberOfDistributors < C.MIN_NUMBER_OF_DISTRIBUTORS) {
            name = Game.spawns.Spawn1.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, { 
                role: 'distributor', working: false});
        }        
        // if not enough upgraders, spawn one
        else if (numberOfUpgraders2 < C.MIN_NUMBER_OF_UPGRADERS2) {
            name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {
                role: 'upgrader2', working: false});
        }
        // if not enough builders, spawn one
        else if (numberOfBuilders2 < C.MIN_NUMBER_OF_BUILDERS2) {
            name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE], undefined, { 
                role: 'builder2', working: false});
        }
        // if not enough repairers, spawn one
        else if (numberOfRepairers2 < C.MIN_NUMBER_OF_REPAIRERS2) {
            name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE], undefined, { 
                role: 'repairer2', working: false});
        }
        // if all roles are maxed, then spawn a repairer
        else {
            name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE], undefined, { 
                role: 'repairer2', working: false});
        }
    
        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (!(name < 0)) {
            console.log("Spawned new creep: " + creep.memory.role);
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////
    
    //TOWER DEFENSE CODE////////////////////////////////////////////////////////////////////////
    var towers = Game.rooms.W13N45.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    
    for (let tower of towers) {
        // code below is for towers repairing
       /* var damagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.hits < 3000000000 
        && (s.structureType==STRUCTURE_WALL || s.structureType==STRUCTURE_RAMPART)});
        tower.repair(damagedWall);
        */
        /*var damagedRampart = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.hits < 3000000000 
        && (s.structureType==STRUCTURE_RAMPART)});
        tower.repair(damagedRampart);
        */
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
            
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
};