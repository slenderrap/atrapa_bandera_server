//archivos de ayuda
function handleMessage (dataJson){

    try{
        const data = JSON.parse(dataJson);
        if (data["move"]){
            console.log("moviment")
        }else{
            console.log("altre cosa")
        }

    }catch (e){
        console.log("error: "+e+" El json era: "+ dataJson);
    }
}

export {handleMessage}