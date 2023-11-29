import mongoose from 'mongoose';


const dbConnect = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDb');
    });
    await mongoose.connect('mongodb+srv://admin:hGC4uf7fv7Gb8Glw@cluster0.cjub8my.mongodb.net/Blog?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    })
}

export default dbConnect;
