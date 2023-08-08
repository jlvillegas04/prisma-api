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

app.get('/api/users', async (req, res) => {
    try {
        console.log(req.query)
        const users = await prisma.users.findMany()
        res.status(200).json({message: 'users obtained successfully', data: users})
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get users', error: {
            ...error,
            detail: error.message,
        }})
    }
})

app.post('/api/users', async (req, res) => {
    try{
        const newUser = req.body
        console.log('--- AC - req.body: ', req.body)
        const createdUser = await prisma.users.create({
            data: { 
                fullname: newUser.fullname,
                address: newUser.address,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            }
        })
        res.status(201).json({message: 'User created successfully', data: createdUser})

    } catch (error) {
        console.log('ERROR: ', error)
        return res.status(400).json({ message: 'Failed to create user', error: {
            ...error,
            detail: error.message,
        }})
    }
})

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.users.findUnique({ where: {
        id,
    }})
    res.status(200).json({message: 'user obtained successfully', data: user})
  } catch (error) {
    return res.status(400).json({ message: 'Failed at fetching user info', error: {
        ...error,
        detail: error.message,
    }})
  }
})

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const {  fullname, address, email, phone, role  } = req.body
    try {
        const updatedUser = await prisma.users.update({
            where: {id: id},
            data: {  
                fullname: fullname, 
                address: address, 
                email: email, 
                phone: phone, 
                role: role  
            }
        })
        res.status(200).json({ message: 'user updated successfully', data: updatedUser })
    } catch (error) {
        return res.status(500).json({  message: 'Failed at updating user info', error: {
            ...error,
            detail: error.message,
        } })
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
        return res.status(500).json({ message: 'Failed to delete user', error: {
            ...error,
            detail: error.message 
        }})
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

