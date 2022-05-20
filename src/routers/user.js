const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const userExists = await User.findOne({email: req.body.email})
        if(userExists){
            return res.status(400).send({
                success: false,
                data: null,
                message: 'Este usuario ya está registrado'
            })
        }
        await user.save()
        res.status(201).send({
            success: true,
            data: user,
            message: 'Usuario creado'
        })
    } catch (error) {
        if(error.code == 11000){
            /* Tuve que agregar esta validación ya que la base de datos tiene indexes en el nombre, apellido y email, por esto,
            la DB no permite crear varias personas con nombres o apellidos repetidos */
            return res.status(400).send({
                success: false,
                data: null,
                message: 'Ya existe un usuario con estos datos'
            })
        }
        res.status(400).send(error)
    }
})
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send({
            success: true,
            data: users,
            message: 'Lista de usuarios'
        })
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send({
                success: false,
                data: null,
                message: 'Usuario no encontrado'
            })
        }
        res.status(200).send({
            success: true,
            data: user,
            message: 'Lista de usuarios'
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.put('/users/:id', async (req, res) => {
    const id = req.params.id
    console.log(id);
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'email']
    /* Esto sirve para validar los campos que estamos recibiendo del front */
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({
            success: false,
            data: null,
            message: 'Campos incorrectos'
        })
    }
    
    try {
        const user = await User.findById(id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (error) {
        if(error.code == 11000){
            /* Tuve que agregar esta validación ya que la base de datos tiene indexes en el nombre, apellido y email, por esto,
            la DB no permite crear varias personas con nombres o apellidos repetidos */
            return res.status(400).send({
                success: false,
                data: null,
                message: 'Ya existe un usuario con estos datos'
            })
        }
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
        let user = await User.findById(id)
        if(!user){
            return res.status(404).send({
                success: false,
                data: null,
                message: 'Usuario no encontrado'
            })
        }
        await user.deleteOne()
        res.status(200).send({
            success: true,
            data: user,
            message: 'Usuario borrado'
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router