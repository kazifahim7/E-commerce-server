const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afhro9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const allDataCollection = client.db("task").collection("allData")
        app.get('/allProduct',async(req,res)=>{
            const categorys = req.query.category;
            const search=req.query.search;
            const sort=req.query.sort;
            console.log(categorys)
            let query={}
            let option={}
            if(categorys){
                if(categorys==='all'){
                    query={}
                }
                else{
                    query = { category : categorys}
                }
            }
            
           if(search){
               if (search !== undefined) {
                   query = { product_name: { $regex: search, $options: 'i' } }
               }
           }
           if(sort){
            if(sort==="High"){

                option = { sort: {price : 1}}

            }
            else if(sort==="Low"){

                option = { sort: {price : -1}}

            }
            else if(sort==="New"){
                option={sort : {date:-1}}
            }
            else {
                option = {}
            }
           }
           
           
            
            
            const result=await allDataCollection.find(query,option).toArray()
            res.send(result)
        })


      




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running............')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})