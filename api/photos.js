const { Router } = require('express')

const { ValidationError } = require('sequelize')
const { requireAuthentication } = require('../lib/auth')

const { Photo, PhotoClientFields } = require('../models/photo')
const { Business, BusinessClientFields } = require('../models/business')


const router = Router()

/*
 * Route to create a new photo.
 */
router.post('/', requireAuthentication, async (req, res, next) => {
  const userBusinesses = await Business.findAll({ where: { ownerId: req.user, id: req.body.businessId }})

  if (userBusinesses) {

    try {
      const photo = await Photo.create(req.body, PhotoClientFields)
      
      res.status(201).send({ id: photo.id })
    } catch (error) {
      
      if (error instanceof ValidationError) {
        res.status(400).send({ error: error.message })
      } else {
        throw error
      }

    }

  } else {
    res.status(403).send({
      error: 'Unauthorized to access specified resource'
    })
  }
})

/*
 * Route to fetch info about a specific photo.
 */
router.get('/:photoId', async (req, res, next) => {
  const photoId = req.params.photoId
  const photo = await Photo.findByPk(photoId)

  if (photo) {
    res.status(200).send(photo)
  } else {
    next()
  }

})

/*
 * Route to update a photo.
 */
router.patch('/:photoId', requireAuthentication, async (req, res, next) => {
  const photoId = req.params.photoId
  const photoUserId = await Photo.findByPk(photoId, { attributes: ['userId'] })

  /*
   * Update photo without allowing client to update businessId or userId.
   */
  const result = await Photo.update(req.body, {
    where: { id: photoId },
    fields: PhotoClientFields.filter(
      field => field !== 'businessId' && field !== 'userId'
    )
  })

  if (req.user !== photoUserId.userId) {
    res.status(403).send({
      error: 'Unauthorized to access specified resource!'
    })
  } else {
    if (result[0] > 0) {
      res.status(204).send()
    } else {
      next()
    }
  }  

})

/*
 * Route to delete a photo.
 */
router.delete('/:photoId', requireAuthentication, async (req, res, next) => {
  const photoId = req.params.photoId
  const result = await Photo.destroy({ where: { id: photoId }})
  
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
  
})

module.exports = router
