const mongoose = require('mongoose');
const { Socket } = require("socket.io")
const Document = require('./Schema /Document')

mongoose.connect('mongodb://127.0.0.1:27017/ai-docs')
  .then(() => console.log('database connected!'));


const io = require("socket.io")(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
})
const defaultValue = ""

io.on("connection", Socket => {
    Socket.on("get-document", async documentId => {
        const document = await findOrCreateDocument(documentId)
        Socket.join(documentId)
        Socket.emit("load-document", document.data)
        Socket.on("send-changes", delta => {
            Socket.broadcast.to(documentId).emit("receive-changes", delta)
    })
    Socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
      })
  
   
    })
    console.log("connected")

})

async function findOrCreateDocument(id) {
    if (id == null) return
  
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
  }