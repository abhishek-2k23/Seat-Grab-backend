import ApiError from "../common/utils/api-error.mjs"
import pool, { query } from "../config/db.mjs"
import { BOOK_SEAT, GET_SEAT, GET_SEATS_QUERY, RESET_SEATS } from "./booking.query.mjs"

class bookingServices {
  static getSeats = async () => {
    const result = await pool.query(GET_SEATS_QUERY)
    return result.rows
  }

  static bookSeat = async (seatId, userName, userId) => {
    const conn = await pool.connect()

    console.log(userId)
    try {
      await conn.query("BEGIN")
      const result = await conn.query(GET_SEAT, [seatId])

      console.log("Row count", result.rowCount)
      if (result.rowCount === 0) {
        await conn.query("ROLLBACK")
        throw ApiError.conflict("Seat is booked already")
      }

      // book ticket
      await conn.query(BOOK_SEAT, [seatId, userName, userId])
      await conn.query("COMMIT")

      // return the booked seat details
      return conn
        .query("SELECT * FROM seats WHERE id = $1", [seatId])
        .then((res) => res.rows[0])
    } catch (err) {
      await conn.query("ROLLBACK")
      if (err instanceof ApiError) throw err
      throw ApiError(500, "Something went wrong while booking the seat")
    } finally {
      conn.release()
    }
  }
  static resetSeats = async () => {
    const result = await query(RESET_SEATS)
    return result.rows
  }
}

export default bookingServices
