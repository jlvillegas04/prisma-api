const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { PrismaClient } = require('@prisma/client')
const app = express()
const prisma = new PrismaClient() 
const port = 8080

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/healthcheck', (_, res) => {
  res.status(200).json('OK')
})

app.get('/api/users', async (_, res) => {
    try {
        const users = await prisma.users.findMany()
        res.status(200).json({message: 'users obtained successfully', data: users})
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get users' })
    }
})

app.post('/api/users', async (req, res) => {
    try{
        const newUser = req.body
        await prisma.users.create({
            data: { 
                fullname: newUser.fullname,
                address: newUser.address,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            }
        })
        res.status(201).json({message: 'User created successfully'})

    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user' })
    }
})

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const {  fullname, address, email, phone, role  } = req.body
    try {
        await prisma.users.update({
            where: {id: id},
            data: {  
                fullname: fullname, 
                address: address, 
                email: email, 
                phone: phone, 
                role: role  
            }
        })
        res.status(200).json({message: 'user updated successfully'})
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user' })
    }
})

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prisma.users.delete({
            where: {id: id},
        })
        return res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete user' })
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

