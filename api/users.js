const { Router } = require('express')

const { Business } = require('../models/business')
const { Photo } = require('../models/photo')
const { Review } = require('../models/review')
const { User } = require('../models/user')

const { authenticateUser, generateAuthToken } = require('../lib/auth')

const router = Router()

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userId/businesses', async (req, res) => {
  const userId = req.params.userId
  const userBusinesses = await Business.findAll({ where: { ownerId: userId }})
  
  res.status(200).send({
    businesses: userBusinesses
  })
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userId/reviews', async (req, res) => {
  const userId = req.params.userId
  const userReviews = await Review.findAll({ where: { userId: userId }})
  
  res.status(200).send({
    reviews: userReviews
  })
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userId/photos', async (req, res) => {
  const userId = req.params.userId
  const userPhotos = await Photo.findAll({ where: { userId: userId }})
  
  res.status(200).send({
    photos: userPhotos
  })
})

/*
 * Route to fetch a specific user
 */
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = await User.findByPk(userId)
  
  if (user) {
    res.status(200).send({
      user: user
    })
  } else {
    res.status(404).send({
      error: 'User not found'
    })
  }

})

/*
 * Route to create a new user
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body, { fields: ['name', 'email', 'password'] })
    
    res.status(201).send({
      id: user.userId
    })
  } catch (error) {
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).send({
        error: 'User already exists'
      })

    } else {
      res.status(400).send({
        error: 'Bad request'
      })
    }
  }
})

/*
 * Route to login a user
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (email && password) {

    try {
      const user = await User.findOne({ where: { email: email }})
      const authenticatedUser = await authenticateUser(user, password)
      
      if (authenticatedUser) {
        const token = generateAuthToken(user.userId, user.admin)

        res.status(200).send({
          token: token
        })
      } else {
        res.status(401).send({
          error: 'Authentication failed'
        })
      }

    } catch (error) {
      res.status(500).send({
        error: 'Internal server error'
      })
    }

  } else {
    res.status(400).send({
      error: 'Bad request'
    })
  }
  
})

module.exports = router
