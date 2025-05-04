let clients = [1,2,3,4,5,6];

const cuatre = clients.slice(0,4);
clients = clients.slice(4)
clients = clients.concat(cuatre)

console.log(clients)

// 2025-04-24 16:09:02.252 13085-14207 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":10,"level":"Level 0","players":[{"id":"C1DF50","x":51.72007599347825,"y":381.8148337246568,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"orc","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"CF0B22","x":959.3688920450321,"y":404.0574526118801,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"CE2C4F","x":68.5067075878018,"y":122.6394290399095,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C2CD30","x":898.5174960597114,"y":46.07902356511788,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"vampire","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C0CFB2","x":969.2401420007673,"y":417.4157975020391,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":559.7509735133467,"y":278.35477627514246,"width":16,"height":32,"keyOwnerId":"","pickedUp":false}],"elapsedTime":18,"gameOver":false}}


//dentro
// vampiro
// 2025-04-24 16:55:12.112 15198-15271 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":22,"level":"Level 0","players":[{"id":"C5BBE1","x":914.613764146005,"y":40.745197199401446,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"vampire","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":760.5216938933447,"y":259.8361362958659,"width":16,"height":32,"keyOwnerId":"","pickedUp":false}],"elapsedTime":59,"gameOver":false}}


//fuera arriba -> y < 0
//human
    //2025-04-24 16:34:56.058 14633-14799 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":22,"level":"Level 0","players":[{"id":"CAF761","x":882.8142290297976,"y":412.2971576846351,"width":16,"height":16,"speedX":75,"speedY":0,"hp":100,"damage":10,"direction":"right","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":true},{"id":"CE9D07","x":127.50639939893897,"y":-45.14379938413311,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":332.7517004594027,"y":296.4309896212544,"width":16,"height":32,"keyOwnerId":"CAF761","pickedUp":true}],"elapsedTime":55,"gameOver":true}}


//fuera abajo -> y > 500 

// orco

    // 2025-04-24 16:29:45.316 14633-14737 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":2,"level":"Level 0","players":[{"id":"CD972D","x":964.5526552058523,"y":106.86288492569652,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"vampire","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C78980","x":97.20732714358543,"y":141.8356776590214,"width":16,"height":16,"speedX":0,"speedY":-75,"hp":100,"damage":10,"direction":"up","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":true},{"id":"C14E1E","x":225.86432117492862,"y":561.4623489292877,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"orc","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":868.9862248325098,"y":150.0197350674625,"width":16,"height":32,"keyOwnerId":"C78980","pickedUp":true}],"elapsedTime":53,"gameOver":true}}
//slime
    //2025-04-24 16:32:28.383 14633-14765 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":10,"level":"Level 0","players":[{"id":"C0C3B3","x":234.20225106645884,"y":80.82339702390404,"width":16,"height":16,"speedX":-75,"speedY":0,"hp":100,"damage":10,"direction":"left","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":true},{"id":"C181B8","x":843.1592326411974,"y":522.1495162657036,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":620.0136009760117,"y":162.17712354108895,"width":16,"height":32,"keyOwnerId":"C0C3B3","pickedUp":true}],"elapsedTime":60,"gameOver":true}}



//fuera izquierda -> x < 0 
// humano

    // 2025-04-24 16:10:57.956 13085-14224 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":24,"level":"Level 0","players":[{"id":"C1DF50","x":51.72007599347825,"y":381.8148337246568,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"orc","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"CF0B22","x":959.3688920450321,"y":404.0574526118801,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"CE2C4F","x":68.5067075878018,"y":122.6394290399095,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"CE4A5B","x":1003.2933773752183,"y":143.1106200947099,"width":16,"height":16,"speedX":75,"speedY":-75,"hp":100,"damage":10,"direction":"upRight","race":"vampire","onIce":false,"attaking":false,"alive":true,"flagOwner":true},{"id":"C81492","x":884.4586352839917,"y":224.55599948045932,"width":16,"height":16,"speedX":75,"speedY":0,"hp":100,"damage":10,"direction":"right","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C263EB","x":-63.049907460762626,"y":69.89296546840416,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":453.42512335359066,"y":393.3081953205464,"width":16,"height":32,"keyOwnerId":"CE4A5B","pickedUp":true}],"elapsedTime":52,"gameOver":false    }}

    //2025-04-24 16:37:13.397 14633-14849 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":4,"level":"Level 0","players":[{"id":"CB7E4B","x":957.5069863530126,"y":33.25233280145772,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"vampire","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"CED5B8","x":497.12466543035055,"y":246.2909034114329,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C5F31E","x":-103.00693566507529,"y":70.71439845348647,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":600.4444271509357,"y":297.8570972943978,"width":16,"height":32,"keyOwnerId":"","pickedUp":false}],"elapsedTime":23,"gameOver":false}}



//fuera derecha -> x > 1000
//slime
    // 2025-04-24 16:38:27.667 14633-14871 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":24,"level":"Level 0","players":[{"id":"CA48D0","x":494.445906907794,"y":250.4244564418429,"width":16,"height":16,"speedX":75,"speedY":-75,"hp":100,"damage":10,"direction":"upRight","race":"orc","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C5E425","x":47.011627253899775,"y":86.45756252980641,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false},{"id":"C8794D","x":1088.8626732210068,"y":311.23542638812836,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":299.0932200825963,"y":166.05127907971513,"width":16,"height":32,"keyOwnerId":"","pickedUp":false}],"elapsedTime":16,"gameOver":false}}




//bug

// 2025-04-24 16:13:26.457 14361-14399 System.out              com.proj                             I  [WaitingRoom] Mensaje: {"type":"update","gameState":{"tickCounter":8,"level":"Level 0","players":
// [{"id":"C1DF50","x":51.72007599347825,"y":381.8148337246568,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"orc","onIce":false,"attaking":false,"alive":true,"flagOwner":false},
// {"id":"CF0B22","x":959.3688920450321,"y":404.0574526118801,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"slime","onIce":false,"attaking":false,"alive":true,"flagOwner":false},
// {"id":"CE2C4F","x":68.5067075878018,"y":122.6394290399095,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"human","onIce":false,"attaking":false,"alive":true,"flagOwner":false},
// {"id":"C6F1A0","x":181.98447865374908,"y":44.35979509902391,"width":16,"height":16,"speedX":-75,"speedY":0,"hp":100,"damage":10,"direction":"left","race":"vampire","onIce":false,"attaking":false,"alive":true,"flagOwner":false},
// {"id":"C1513D","x":80.81470322254675,"y":438.75800451549776,"width":16,"height":16,"speedX":0,"speedY":0,"hp":100,"damage":10,"direction":"none","race":"orc","onIce":false,"attaking":false,"alive":true,"flagOwner":false}],"flagOwnerId":"","keys":[{"x":825.9332651843074,"y":121.51429465875006,"width":16,"height":32,"keyOwnerId":"","pickedUp":false}],"elapsedTime":23,"gameOver":false}}
