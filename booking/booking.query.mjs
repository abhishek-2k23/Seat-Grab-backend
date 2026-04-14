export const GET_SEATS_QUERY = "SELECT * from seats"
export const GET_SEAT = "SELECT * FROM seats WHERE id = $1 and isbooked = 0 FOR UPDATE"
export const BOOK_SEAT = "update seats set isbooked = 1, name = $2, user_id = $3 WHERE id = $1"