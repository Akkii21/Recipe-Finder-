import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000; 
const URL  = "https://www.themealdb.com/api/json/v1/1";

app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.render("index.ejs",{ meals: null, error: null} )
})

app.post("/search", async (req, res)=>{
    const ingredient = req.body.ingredient
    try{
        const response = await axios.get(`${URL}/filter.php`,{
            params: {i: ingredient},
        });
        res.render("index.ejs",{meals: response.data.meals, error: null });
    } catch(error){
        console.log("Search Failed", error.message);
        res.render("index.ejs",{
            meals: null,
            error:`No recipe found for the "${ingredient}". Please try another ingredient `
        });
    }
});

app.get("/recipe/:id", async(req,res)=>{
    const recipeId = req.params.id;
    try{
        const response = await axios.get(`${URL}/lookup.php?i=${recipeId}`);
    
    const meal = response.data.meals[0];
    const ingredients = [];
    for(let i=1; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]}  -${meal[`strMeasure${i}`]}`)
        }
        else{
            break;
        }
    }
    res.render("recipe.ejs", {meal: meal, ingredients: ingredients, error: null})
    } catch(error){
        console.error("failed to fetch recipe details: ", error.message);
        res.render("recipe.ejs",{
            meal: null,
            ingredients: [],
            error: "could not fetch recipe details"
        });
    }
});



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})