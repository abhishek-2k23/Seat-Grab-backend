import Joi from "joi";
import BaseDto from "../common/dto/base.dto.mjs";

class BookingDto extends BaseDto {
    static schema = Joi.object({
        showId: Joi.string().required(),
        name: Joi.string().required(),
    })
}

export default BookingDto;