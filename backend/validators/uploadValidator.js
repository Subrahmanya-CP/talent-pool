import Joi from 'joi';

export const uploadResumeSchema = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        originalname: Joi.string().required(),
        mimetype: Joi.string()
          .valid('application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          .required(),
        size: Joi.number().max(10 * 1024 * 1024).required(), // 10MB max
        buffer: Joi.any().required(),
      })
    )
    .min(1)
    .max(10)
    .required(),
});
