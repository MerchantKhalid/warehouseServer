const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.v1swycp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// middleware
function verifyJWT(req,res,next){
    const authHeader= req.headers.authorization
    if(!authHeader){
        return res.status(401).send('UnAuthorised Access')
    }
    const token= authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
        if(err){
            return res.status(403).send({message:'Forbidden Access'})
        }
        req.decoded = decoded
        next()
    })


}
 
async function run(){
    try{
        const categoryCollection = client.db('milestone12').collection('carcollection')

        const allCategoryCollection = client.db('milestone12').collection('category')
        const carCollection = client.db('milestone12').collection('allcar')
        const userBooking = client.db('milestone12').collection('userbooking')
        const usersCollection = client.db('milestone12').collection('users')



        app.get('/car-category',async(req,res)=>{
            const query = {}
            const categories = await allCategoryCollection.find(query).toArray()
            res.send(categories)
        })


        // all-car-category
        

            app.get('/allcategories/:id',async(req,res)=>{
                //   const id = req.params.id;
                //   const query = {}
                //   const car = await carCollection.find(query).toArray()
                //   res.send(car)


                const id = req.params.id;
                const query={}
                const car = await carCollection.find(query).toArray()
                const selectedCategory=car.filter(c=>c.categoryid===id);
                // const car = await carCollection.find(query).toArray()
                res.send(selectedCategory)
                   
                 })

                 //single car details
              app.get('/alldata/:id',async(req,res)=>{
                          const id = req.params.id;
                          const query = {_id:ObjectId(id)}
                          const car = await carCollection.findOne(query)
                            // const selectedCar= car.find(p=>p._id===id);
                          res.send(car)
                    
                 })
            

            
           
        // booked an Appointment
        app.post('/booking',async(req,res)=>{
            const booking = req.body
            console.log(booking)
            const query = {
                model:booking.model
            }
            const alreadybooked = await userBooking.find(query).toArray()
                const result = await userBooking.insertOne(booking)
                res.send(result)
            
        })

        // Booking
        app.get('/bookings',async(req,res)=>{
            const email=req.query.email
            // const decodedEmail= req.decoded.email
            // if(email !== decodedEmail){
            //     return res.status(403).send({message:'Forbidden Access'})
            // }
            const query = {email:email}
            const bookings = await userBooking.find(query).toArray()
            res.send(bookings)
        })

        //jwt
        app.get('/jwt',async(req,res)=>{
            const email= req.query.email
            const query = {email:email}
            const user = await usersCollection.findOne(query)
            if(user){
                const token = jwt.sign({email},process.env.ACCESS_TOKEN)
                res.send({accessToken:token})
            }
            
            res.status(403).send({accessToken:''})
        })

        // users
        app.post('/users',async(req,res)=>{
            const users = req.body
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        

         // all category
        //  app.get('/categories',async(req,res)=>{
        //     const query = {}
        //     const options = await categoryCollection.find(query).toArray()
        //     res.send(options)

        // })

        // app.get('/categories/:id',async(req,res)=>{
        //     const id = req.params.id;
        //     const selectedCategory= await bookingOptionsCollection.filter(c=>c.category_id===id);
        //     res.send(selectedCategory)
   
        // })

        //category
//     app.get('/allcategories/:id',(req,res)=>{
//     const id = req.params.id;
//     if(id=='63816c004e363fd9e0df26b9'){
//         res.send(bookingOptionsCollection)
//     }else{
//         const selectedCategory=bookingOptionsCollection.find(c=>c.category_id===id);
//         res.send(selectedCategory)
//     }
    
    
// })



         
        // all data
//         app.get('/alldata',async(req,res)=>{
//             const query = {}
//             const options = await bookingOptionsCollection.find(query).toArray()
//             res.send(options)

//         })
       
//         // car
//         app.get('/alldata/:id',(req,res)=>{
//           const id = req.params.id;
//           const selectedCar= bookingOptionsCollection.find(p=>p._id===id);
//           res.send(selectedCar)
    
// })


    }finally{

    }

}
run().catch(console.log)



















// 


// const categories = require('./data/categories.json')
// const product = require('./data/product.json')



app.get('/',(req,res)=>{
    res.send('Server is Running')
})
// all-car-category
// app.get('/car-category',(req,res)=>{
//     res.send(categories)
// })

//all car collection
// app.get('/car',(req,res)=>{
//     res.send(product)
// })

//category
// app.get('/allcategories/:id',(req,res)=>{
//     const id = req.params.id;
//     if(id=='08'){
//         res.send(product)
//     }else{
//         const selectedCategory=product.filter(c=>c.category_id===id);
//         res.send(selectedCategory)
//     }
    
    
// })

// car
// app.get('/car/:id',(req,res)=>{
//     const id = req.params.id;
//     const selectedCar=product.find(p=>p._id===id);
//     res.send(selectedCar)
    
// })

app.listen(port,()=>{
    console.log('Server is Active on port',port)
})