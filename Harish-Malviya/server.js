const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

app.use(express.json());

let hotels = [];
let users = [];


passport.use(new LocalStrategy(async (username, password,done)=>{
    const user = users.find((u)=>u.username == username);
    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!user){
        return done(null , false);
    }
    if(!isPasswordValid){
        return done(null, false);
    }
    return done(null, user);

}));
 
app.use(passport.initialize());
const isAuthenticated = passport.authenticate('local', {session:false});


app.post("/register",async (request, response)=>{

    try {

        const {name ,username , email, password} = request.body;

         if(!name){
            return response.status(400).json({message: "name field required"});
        }else if(!username){
            return response.status(400).json({message: "usernmae field required"});
        }
        else if(!email){
            return response.status(400).json({message: "email field required"});
        }
        else if(!password){
            return response.status(400).json({message: "password field required"});
        }

        const hashpassword = await bcrypt.hash(password , 10);

        const newUser={
            id:users.length+1,
            name:request.body.name,
            username:request.body.username,
            email:request.body.email,
            password:hashpassword
        }


        users.push(newUser);
        response.status(200).json({message:"user created successfully"});


    } catch(error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/hotels",(request, response)=>{
    try {
        const newHotels={
            id:hotels.length+1,
            name:request.body.name,
            location:request.body.location,
            rating:request.body.rating,
            pricePerNight:request.body.pricePerNight
        }
        hotels.push(newHotels);
        response.status(200).json({message:"hotels created successfully"});
    } catch (error) {
        response.status(500).json(error);
    }
});

app.get("/",(request, response)=>{
    try {
        response.status(200).json({message:"welcome to hotel api"});
    } catch (error) {
        response.status(500).json(error);
    }

});

app.get("/hotels",(request, response)=>{
    try {
        response.status(200).json(hotels);

    } catch (error) {
        response.status(500).json(error);
    }

});

app.get("/hotels/:id",(request, response)=>{
    try {
        const hotel = hotels.find((c)=>c.id == request.params.id);
        if(!hotel){
            response.status(404).json({message:"college is not found"});
        }
        else{
            response.status(200).json(hotel);
        }
    } catch (error) {
        response.status(500).json(error);
    }
    

});

app.put("/hotels/:id",(request, response)=>{
    try {
        const hotel = hotels.find((c)=>c.id == request.params.id);
        if(!hotel){
            response.status(404).json({message:"hotel is not found"});
        }
        else{
            hotel.name = request.body.name;
            hotel.location = request.body.location;
            hotel.rating = request.body.rating;
            hotel.price  = request.body.price;
            response.status(200).json({message:"updated hotel id is updated to ",hotel} );
        }
    } catch (error) {
        response.status(500).json(error);
    }
    

});


app.delete("/hotels/:id",(request, response)=>{
    try {
        const hotelIndex = hotels.find((c)=>c.id == request.params.id);
        
        if(!hotelIndex){
            response.status(404).json({message:"hotel is not found"});
            
        }
        else{
            hotels.splice(hotelIndex , 1);
            response.status(200).json({message:"deleted the hotel " });
           
        }
    } catch (error) {
        response.status(500).json(error);
    }
});



app.listen(4000,()=>{
    console.log("server is runnning on 4000");
})