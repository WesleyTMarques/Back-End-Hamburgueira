const express = require ('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json()) //determina que todo projeto utilizara json

const orders = []

const checkOrderId = (request, response, next) =>{
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({error: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMethod = (request, response, next) => {
    console.log (`O método da requisição é ${request.method} e sua URl é ${request.url}`)

    next()
}

app.post('/order', checkMethod, (request, response) =>{
    const {clientName, order, price} = request.body

    const newOrder = {id:uuid.v4(), clientName, order, price, status:"Em preparação"}
    
    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get('/order', checkMethod, (request, response) => {
    return response.json(orders)
})

app.put('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const {clientName, order, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = {id, clientName, order, price, status}

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const {clientName, order, price, status} = request.body
    const index = request.orderIndex

    const specificOrder = orders[index]

    return response.json(specificOrder)
})

app.patch('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const {clientName, order, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedStatus = {id, clientName:orders[index].clientName, order:orders[index].order, price:orders[index].price, status:"Pronto"}

    orders[index] = updatedStatus

    return response.json(updatedStatus)
})

app.listen(port, () =>{
    console.log(`🚀 Server started on port ${port}`)
})