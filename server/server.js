const mongoose = require('mongoose');
const { Socket } = require("socket.io")

mongoose.connect('mongodb://localhost:27017/ai-docs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(console.log('Connected to MongoDB'))
    .catch(err => console.log(err))

const io = require("socket.io")(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
})

io.on("connection", Socket => {
    Socket.on("get-document", documentId => {
        const data=""
        Socket.join(documentId)
        Socket.emit("load-document", data)
        Socket.on("send-changes", delta => {
            Socket.broadcast.to(documentId).emit("receive-changes", delta)
    })
   
    })
    console.log("connected")

})