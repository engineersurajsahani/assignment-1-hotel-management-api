const express = require('express');
let users=[];
let hotels=[];
const app = express();
app.use(express.json());


app.get("/hotels",(request,response)=>{
    try{
        response.status(200).json(hotels);
    }
    catch(error){
        response.status(500).json(error);
    }
})
app.get("/hotels/:id",(request,response)=>{
    try{
        const hotel=hotels.find((h)=>h.id==request.params.id);
        if(!hotel){
            return response.status(404).json({message:"Hotel Not Found!"})
        }
        else{
            response.status(200).json(hotel);
        }
    }catch(error){
        response.status(500).json(error);
    }
});
app.post("/hotels",(request,response)=>{
    try {
        const newhotel={
            id:hotels.length +1,
            name:request.body.name,
            location:request.body.location,
            rating:request.body.rating,
            pricepernight:request.body.pricepernight
        }
        hotels.push(newhotel);
        response.status(200).json({message:"Hotel added succesfully"})
    } catch (error) {
        response.status(500).json(error);
        
    }
});
app.put("/hotels/:id",(request,response)=>{
    try {
        const hotel=hotels.find((h)=>h.id==request.params.id);
        if(!hotel){
            return response.status(404).json({message:"Hotel Not Found!"})
        }
        else{
            hotel.name=request.body.name;
            hotel.location=request.body.location;
            hotel.rating=request.body.rating;
            hotel.pricepernight=request.body.pricepernight;
            response.status(200).json({message:"Hotel updated succesfully"})
        }
    } catch (error) {
        response.status(500).json(error);
        
    }
});
app.delete("/hotels/:id",(request,response)=>{
    try {
        const hotelIndex=hotels.findIndex((h)=>h.id==request.params.id);            
        if(hotelIndex===-1){
            return response.status(404).json({message:"Hotel Not Found!"})
        }
        else{
            hotels.splice(hotelIndex,1);
            response.status(200).json({message:"Hotel deleted succesfully"})
        }
    } catch (error) {
        response.status(500).json(error);
        
    }
});

app.listen(4000,()=>{
    console.log("Server is runnning")
})



