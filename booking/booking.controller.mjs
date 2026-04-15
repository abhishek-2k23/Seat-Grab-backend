import ApiResponse from "../common/utils/api-response.mjs";
import bookingServices from "./booking.service.mjs"

class bookingController {
    static getSeats = async (req, res) => {
        const seats = await bookingServices.getSeats();
        ApiResponse.ok(res, "All seats fetched", {seats})
    }

    static bookSeats = async (req, res) => {
        console.log(req.params.id, req.params.name)
        console.log(req.user.id)
        const bookedSeat = await bookingServices.bookSeat(req.params.id, req.params.name, req.user.id);
        ApiResponse.created(res, "Seat booked Successfully", {bookedSeat})
    }
}

export default bookingController;