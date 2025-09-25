const contactRouter = require('express').Router()
const Contact = require('../models/contact')

contactRouter.get('/', async (request, response) => {
  try {
    const contacts = await Contact
      .find({})
      .sort({ createdAt: -1 })
    response.json(contacts)
  } catch (error) {
    response.status(500).json({ error: 'Server error' })
  }
})

contactRouter.get('/:id', async (request, response) => {
  try {
    const contact = await Contact.findById(request.params.id)
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).json({ error: 'Contact not found' })
    }
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

contactRouter.post('/', async (request, response) => {
  const { name, number, email, comments } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const contact = new Contact({
    name,
    number,
    email,
    comments: comments || '',
    createdAt: new Date()
  })

  try {
    const savedContact = await contact.save()
    response.status(201).json(savedContact)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

contactRouter.delete('/:id', async (request, response) => {
  try {
    const contact = await Contact.findByIdAndDelete(request.params.id)
    if (contact) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'Contact not found' })
    }
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

contactRouter.put('/:id', async (request, response) => {
  const { name, number, email, comments } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const contactToUpdate = {
    name,
    number,
    email,
    comments: comments || ''
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      request.params.id,
      contactToUpdate,
      { new: true, runValidators: true }
    )
    
    if (updatedContact) {
      response.json(updatedContact)
    } else {
      response.status(404).json({ error: 'Contact not found' })
    }
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = contactRouter
