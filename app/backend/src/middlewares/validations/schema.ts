import Joi from 'joi';

export const validateDataMeter = (body: object) => {
  const schemaMessage = Joi.object({
    image: Joi.string().required(),
    customerCode: Joi.string().required(),
    measureDatetime: Joi.date().required(),
    measureType: Joi.string().valid('WATER', 'GAS').required(),
  });

  const { error, value } = schemaMessage.validate(body);

  if (error) {
    const err = new Error(error.details[0].message);
    err.name = 'BadRequest';
    throw err;
  }

  return value;
};

export const validateResponseMeter = () => {

};
