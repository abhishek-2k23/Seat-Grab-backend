import Joi from "joi";
import BaseDto from "../../common/dto/base.dto.mjs";

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string()
        .messages({ 'any.only': 'Password is required!' })
        .min(8).required(),
    })
}

export default RegisterDto