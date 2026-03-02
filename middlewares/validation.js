const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'any.required': 'The "name" field is required',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.uri': 'The "avatar" field must be a valid URL',
      'any.required': 'The "avatar" field is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'The "email" field must be a valid email',
      'any.required': 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'The "password" field is required',
    }),
  }),
});

const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'The "email" field must be a valid email',
      'any.required': 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'The "password" field is required',
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'any.required': 'The "name" field is required',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.uri': 'The "avatar" field must be a valid URL',
      'any.required': 'The "avatar" field is required',
    }),
  }),
});

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'any.required': 'The "name" field is required',
    }),
    weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
      'any.only': 'The "weather" field must be one of: hot, warm, cold',
      'any.required': 'The "weather" field is required',
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      'string.uri': 'The "imageUrl" field must be a valid URL',
      'any.required': 'The "imageUrl" field is required',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      'string.hex': 'The "itemId" field must be a valid hex string',
      'string.length': 'The "itemId" field must be 24 characters long',
      'any.required': 'The "itemId" field is required',
    }),
  }),
});

module.exports = {
  validateUserSignup,
  validateUserSignin,
  validateUserUpdate,
  validateClothingItem,
  validateId,
};
