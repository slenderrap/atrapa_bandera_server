'use strict';
const fs = require('fs');
const gameData = JSON.parse(fs.readFileSync("server/flag_game/game_data.json", "utf8"));
const gameLevel = gameData.levels[0];

const RACES= ['human', 'orc', 'vampire', 'slime'];
const TICK_FPS = 25;
const FOCUS_WIDTH = 1000;
const FOCUS_HEIGHT = 500;
const FRICTION_FLOOR = 350;
const FRICTION_ICE = 50;
const MOVEMENT_SPEED = 75;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;

const DIRECTIONS = {
    "up":         { dx: 0, dy: -1 },
    "upLeft":     { dx: -1, dy: -1 },
    "left":       { dx: -1, dy: 0 },
    "downLeft":   { dx: -1, dy: 1 },
    "down":       { dx: 0, dy: 1 },
    "downRight":  { dx: 1, dy: 1 },
    "right":      { dx: 1, dy: 0 },
    "upRight":    { dx: 1, dy: -1 },
    "none":       { dx: 0, dy: 0 }
};
 
class GameLogic {
    constructor() {
        this.players = new Map();
        this.tickCounter = 0;
        this.elapsedTime = 0;
        this.gameOver = false;
        this.keys = new Map()
    }

    // Es connecta un client/jugador
    addPlayer(id) {
        let race = this.getAvailableRace();
        let pos = this.getValidPosition(race);

        this.players.set(id, {
            id,
            x: pos.x,
            y: pos.y,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            speedX: 0,
            speedY: 0,
            hp: 100,
            damage: 10,
            direction: "none",
            race,
            onIce: false,
            attaking: false,
            alive: true,
            isDamaged: false,
            flagOwner: false
        });
        this.flagOwnerId = "";
        
        

        return this.players.get(id);
    }

    addKey(){
        console.log("creando llave");
        const id = 1;
        let pos = this.getValidPosition();
        this.keys.set(id,{
            x: pos.x,
            y: pos.y,
            width: 16,
            height: 32,
            keyOwnerId: "",
            pickedUp: false
        }
        )
        console.log(`clau creada en x: ${this.keys.get(1).x} y: ${this.keys.get(1).y}`);
    }

    removeKeys(){
        this.keys.clear();
    }

    setKeyOwnerId(keyOwnerId){
        console.log("Has cogido la llave");
        this.keys.get(1).keyOwnerId = keyOwnerId;
        this.keys.get(1).pickedUp= true;
        this.players.get(keyOwnerId).flagOwner = true;
    }

    removePlayers(){
        this.players.clear();
    }


    addPlayers(ids){
        for (let i=0;i<ids.length;i++){
            this.addPlayer(ids[i]);
        }
    }

    // Es desconnecta un client/jugador
    removeClient(id) {
        this.players.delete(id);
    }

    // Tractar un missatge d'un client/jugador
    handleMessage(id, msg) {
        try {
            let obj = JSON.parse(msg);
            if (!obj.type) return;
            switch (obj.type) {
            case "direction":
                if (this.players.has(id) && DIRECTIONS[obj.value]) {
                    this.players.get(id).direction = obj.value;
                }
                break;
            default:
                break;
            }
        } catch (error) {}
    }
    isPlayerInSpawnZone(player) {
        // Filtrar las zonas de spawn correspondientes a la raza del jugador
        const spawnZones = gameLevel.zones.filter(zone => zone.type === `spawn_${player.race}`);
        
        // Si no hay zonas de spawn para esta raza, retornar false
        if (spawnZones.length === 0) return false;
    
        // Iterar sobre las zonas de spawn y verificar si el jugador está dentro de alguna
        for (const zone of spawnZones) {
            if (
                player.x + player.width > zone.x &&
                player.x < zone.x + zone.width &&
                player.y + player.height > zone.y &&
                player.y < zone.y + zone.height
            ) {
                return true; // El jugador está dentro de una zona de spawn
            }
        }
    
        return false; // El jugador no está en ninguna zona de spawn
    }

    // Blucle de joc (funció que s'executa contínuament)
    updateGame(fps) {
        let deltaTime = 1 / fps;

        this.tickCounter = (this.tickCounter + 1) % TICK_FPS;
        
        if (!this.gameOver){
            this.elapsedTime += deltaTime;
        }
        if(this.elapsedTime>60||this.players.size<1){
            this.gameOver=true;
        }

        this.players.forEach(player => {
            let moveVector = DIRECTIONS[player.direction];
            
            // Check if player is on ice
            player.onIce = false;
            if (gameLevel && gameLevel.zones) {
                gameLevel.zones.forEach(zone => {
                    if (zone.type === "ice" && this.areRectsColliding(
                        player.x, player.y, player.width, player.height, 
                        zone.x, zone.y, zone.width, zone.height)) {
                        player.onIce = true;
                    }
                });
            }
            
            // Apply movement and friction based on surface
            const friction = player.onIce ? FRICTION_ICE : FRICTION_FLOOR;
            
            // Handle X movement
            if (moveVector.dx !== 0) {
                if (!player.flagOwner) player.speedX = moveVector.dx * MOVEMENT_SPEED; else player.speedX = moveVector.dx * (MOVEMENT_SPEED-25) 
            } else {
                if (player.speedX > 0) {
                    player.speedX = Math.max(0, player.speedX - friction * deltaTime);
                } else if (player.speedX < 0) {
                    player.speedX = Math.min(0, player.speedX + friction * deltaTime);
                }
            }
            
            // Handle Y movement
            if (moveVector.dy !== 0) {
                if (!player.flagOwner) player.speedY = moveVector.dy * MOVEMENT_SPEED; else  player.speedY = moveVector.dy * (MOVEMENT_SPEED-25); 
            } else {
                if (player.speedY > 0) {
                    player.speedY = Math.max(0, player.speedY - friction * deltaTime);
                } else if (player.speedY < 0) {
                    player.speedY = Math.min(0, player.speedY + friction * deltaTime);
                }
            }
            
            // Calculate next position
            let nextX = player.x + player.speedX * deltaTime;
            let nextY = player.y + player.speedY * deltaTime;
            // Check collisions with floor areas (unwalkable)
            let canMoveX = true;
            let canMoveY = true;
            
            if (nextX < 5 || nextX >985) canMoveX = false;
            if (nextY < 25 || nextY >460) canMoveY = false;

            if (gameLevel && gameLevel.zones) {
                gameLevel.zones.forEach(zone => {
                    if (zone.type === "stone") {
                        // Check X collision
                        if (this.areRectsColliding(
                            nextX, player.y, player.width, player.height,
                            zone.x, zone.y, zone.width, zone.height)) {
                            canMoveX = false;
                        }
                        
                        // Check Y collision
                        if (this.areRectsColliding(
                            player.x, nextY, player.width, player.height,
                            zone.x, zone.y, zone.width, zone.height)) {
                            canMoveY = false;
                        }
                    }
                });
            }
            
            // Apply movement if allowed
            if (canMoveX) {
                player.x = nextX;
            } else {
                player.speedX = 0;
            }
            
            if (canMoveY) {
                player.y = nextY;
            } else {
                player.speedY = 0;
            }
            
            // Check flag collision
            if (this.flagOwnerId == "") {
                let flag = gameLevel.sprites.find(sprite => sprite.type === 'flag');
                if (flag) {
                    let flgCollisionX = flag.x - flag.width / 2;
                    let flgCollisionY = flag.y - flag.height / 2;
                    if (this.areRectsColliding(
                        nextX, player.y, player.width / 2, player.height / 2, 
                        flgCollisionX, flgCollisionY, flag.width, flag.height)) {
                        this.flagOwnerId = player.id;
                        player.flagOwner = true;
                    }
                }
            }    
            if (!this.gameOver) {
                this.keys.forEach(key => {
                    if (key) {
                        let keyCollisionX = key.x - key.width / 2;
                        let keyCollisionY = key.y - key.height / 2;
                        if (this.areRectsColliding(
                            nextX, player.y, player.width / 2, player.height / 2, 
                            keyCollisionX, keyCollisionY, key.width, key.height) && !key.pickedUp) {
                            this.setKeyOwnerId(player.id)
                            key.pickedUp=true;
                        }
                    }   
                    if (this.keys.get(1).keyOwnerId === player.id && this.isPlayerInSpawnZone(player)) {
                        console.log(`Jugador ${player.id} ha llevado la llave a su zona de spawn.`);
                        this.gameOver = true;
                        return;
                    }  
                    
                });
                

            }

        });
    }

    // Obtenir una posició on no hi h ha ni objectes ni jugadors
    // Obtenir una posició on no hi ha ni objectes ni jugadors
    getValidPosition(race = "default") {
        // identificar la zona d'aparició de la race

        let minX=0;
        let minY=0;
        let maxX=0;
        let maxY=0;
        if (race!=="default"){
            const spawnZones = gameLevel.zones.filter(zone => zone.type === `spawn_${race}`);

            if (spawnZones.length === 0) {
                throw new Error(`No spawn zone found for race: ${race}`);
            }

            // Seleccionar una zona de spawn aleatoria
            const spawnZone = spawnZones[Math.floor(Math.random() * spawnZones.length)];

            // Definir límites de posición dentro de la zona
            minX = spawnZone.x;
            minY = spawnZone.y;
            maxX = spawnZone.x + spawnZone.width - PLAYER_WIDTH;
            maxY = spawnZone.y + spawnZone.height - PLAYER_HEIGHT;
        }else{

            minX = 100;
            minY = 100;
            maxX = FOCUS_WIDTH - 100;
            maxY = FOCUS_HEIGHT - 100;    
        }


        // Intent màxim per evitar un bucle infinit
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            // Generar una posició aleatòria dins els límits
            let x = minX + Math.random() * (maxX - minX);
            let y = minY + Math.random() * (maxY - minY);
            
            // Comprovar si la posició col·lisiona amb alguna zona de pedra
            let isValidPosition = true;
            
            if (gameLevel && gameLevel.zones) {
                for (const zone of gameLevel.zones) {
                    if (zone.type === "stone" && this.areRectsColliding(
                        x, y, PLAYER_WIDTH, PLAYER_HEIGHT,
                        zone.x, zone.y, zone.width, zone.height)) {
                        isValidPosition = false;
                        break;
                    }
                }
            }
            
            // Si la posició és vàlida, retornar-la
            if (isValidPosition) {
                return { x, y };
            }
            
            attempts++;
        }
        
        // Si després de varios intents no trobem posició vàlida, tornem un punt central segur
        // (assumint que el centre del mapa no sigui una pedra)
        return { 
            x: (minX + maxX) / 2, 
            y: (minY + maxY) / 2 
        };
    }
    
    // Obtenir una raca aleatori que no ha estat escollit abans
    getAvailableRace() {
        let assignedRaces = new Set(Array.from(this.players.values()).map(player => player.race));
        let availableRaces = RACES.filter(race => !assignedRaces.has(race));
        return availableRaces.length > 0 
          ? availableRaces[Math.floor(Math.random() * availableRaces.length)]
          : RACES[Math.floor(Math.random() * RACES.length)];
    }

    // Detectar dos rectangles es sobreposen
    areRectsColliding(r0x, r0y, r0w, r0h, r1x, r1y, r1w, r1h) {
        return (
          r0x < r1x + r1w &&
          r0x + r0w > r1x &&
          r0y < r1y + r1h &&
          r0y + r0h > r1y
        );
    }
    
    // Retorna l'estat del joc (per enviar-lo als clients/jugadors)
    getGameState() {
        return {
            tickCounter: this.tickCounter,
            level: "Level 0",
            players: Array.from(this.players.values()),
            flagOwnerId: this.flagOwnerId,
            keys: Array.from(this.keys.values()),
            elapsedTime: Math.floor(this.elapsedTime),
            gameOver: this.gameOver 
        };
    }
}

module.exports = GameLogic;