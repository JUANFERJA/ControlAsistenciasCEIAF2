export const PathServer = () =>{
    
    //path para las rutas 
    let rutaProd = "ControlAsistencia"
    let rutaTest = "ControlAsistenciaTest"


    let apiProd = "https://pcs.sistran.com/ApiPCSProduccion/api/";
    let apiTest = "https://localhost:7195/api/";
   

    
    return(
       
         {       
          routeVersion: rutaTest,         
          routeApi : apiTest
         }      

    )
}