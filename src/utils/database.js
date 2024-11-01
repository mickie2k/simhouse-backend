import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
let pool = null;

async function initSQL() {
	try {
		pool = mysql.createPool({
			host: process.env.HOST,
			user: process.env.DB_USER,
			database: process.env.DB,
			waitForConnections: true,
			connectionLimit: 10, // Adjust the limit as necessary
			queueLimit: 0,
		});
		console.log("Connected to Database");
	} catch (error) {
		console.error("Can't connect to Database:", error);
	}
}

export async function getUserNameDB(id) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT FName, LName, Username FROM customer WHERE CustomerID = ?";
		const [rows] = await connection.query(sql, [id]);
		return rows[0];
	} catch (error) {
		console.error("Error in getUserNameDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function getUserByID(id) {
	const connection = await pool.getConnection();
	try {
		const sql = "SELECT FName, LName FROM customer WHERE CustomerID = ?";
		const [rows] = await connection.query(sql, [id]);
		return rows;
	} catch (error) {
		console.error("Error in getUserByID:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function gethostByID(id) {
	const connection = await pool.getConnection();
	try {
		const sql = "SELECT FName, LName FROM host WHERE HostID = ?";
		const [rows] = await connection.query(sql, [id]);
		return rows;
	} catch (error) {
		console.error("Error in gethostByID:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function userLoginDB(username, password) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT CustomerID, Username, FName, LName, CTel FROM customer WHERE Username = ? AND Password = ?";
		const [rows] = await connection.query(sql, [username, password]);
		return rows[0];
	} catch (error) {
		console.error("Error in userLoginDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function userRegisterDB(userData) {
	const connection = await pool.getConnection();
	try {
		const sql = "INSERT INTO customer SET ?";
		const [rows] = await connection.query(sql, userData);
		return true;
	} catch (error) {
		console.error("Error in userRegisterDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function hostLoginDB(username, password) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT HostID, Username, FName, LName, HTel FROM host WHERE Username = ? AND Password = ?";
		const [rows] = await connection.query(sql, [username, password]);
		return rows[0];
	} catch (error) {
		console.error("Error in hostLoginDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function hostRegisterDB(hostData) {
	const connection = await pool.getConnection();
	try {
		const sql = "INSERT INTO host SET ?";
		const [rows] = await connection.query(sql, hostData);
		return true;
	} catch (error) {
		console.error("Error in hostRegisterDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

// Product DB functions
async function productAllDB(limit, page) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM simulatorlist LEFT JOIN simulatormodel ON simulatorlist.ModID = simulatormodel.ModID LEFT JOIN simulatorbrand ON simulatormodel.BrandID = simulatorbrand.BrandID LIMIT ? OFFSET ?";
		const [rows] = await connection.query(sql, [limit, page]);
		return rows;
	} catch (error) {
		console.error("Error in productAllDB:", error);
		return false;
	} finally {
		connection.release();
	}
}
export async function productAllByTypeDB(type, limit, page) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM simulatorlist INNER JOIN simulatortypelist ON simulatorlist.simid = simulatortypelist.simid LEFT JOIN simulatormodel ON simulatorlist.ModID = simulatormodel.ModID LEFT JOIN simulatorbrand ON simulatormodel.BrandID = simulatorbrand.BrandID WHERE simulatortypelist.simtypeid = ?  ORDER BY simulatorlist.SimID LIMIT ? OFFSET ? ";
		const [rows] = await connection.query(sql, [type, limit, page]);
		return rows;
	} catch (error) {
		console.error("Error in productAllDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function productidDB(simid) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM simulatorlist LEFT JOIN host ON simulatorlist.hostid = simulatorlist.hostid LEFT JOIN simulatormodel ON simulatorlist.ModID = simulatormodel.ModID LEFT JOIN simulatorbrand ON simulatormodel.BrandID = simulatorbrand.BrandID WHERE simulatorlist.SimID = ?";
		const [rows] = await connection.query(sql, [simid]);
		return rows[0];
	} catch (error) {
		console.error("Error in productAllDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

export async function productBookingDB(simid) {
	const connection = await pool.getConnection();

	try {
		const sql =
			"SELECT * FROM simulatorschedule WHERE SimID = ? AND Date BETWEEN NOW() AND (NOW() + INTERVAL 7 DAY) Order by Date , StartTime";
		const [rows] = await connection.query(sql, [simid]);
		return rows;
	} catch (error) {
		console.error("Error in productAllDB:", error);
		return false;
	} finally {
		connection.release();
	}
}
// End of Product DB functions

// Booking DB functions
async function scheduleFromSimIDDB(simID) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM simulatorlist LEFT JOIN simulatorschedule ON simulatorlist.SimID = simulatorschedule.SimID WHERE simulatorlist.SimID = ?";
		const [rows] = await connection.query(sql, [simID]);
		return rows;
	} catch (error) {
		console.error("Error in scheduleFromSimIDDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function bookingFromCustomerIDDB(customerId) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM booking LEFT JOIN bookingstatus ON booking.StatusID = bookingstatus.StatusID WHERE customerid = ? ORDER BY booking.BookingDate DESC";
		const [rows] = await connection.query(sql, [customerId]);
		return rows;
	} catch (error) {
		console.error("Error in bookingFromCustomerIDDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function scheduleFromBookingIDDB(bookingId, customerId) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT booking.BookingID,booking.BookingDate,booking.TotalPrice,booking.StatusID,booking.CustomerID,booking.SimID,bookinglist.ScheduleID,simulatorschedule.Price,simulatorschedule.Date,simulatorschedule.StartTime,simulatorschedule.EndTime,simulatorlist.SimListName,simulatorlist.PricePerHour,simulatorlist.HostID,host.FName,host.AddressDetail,host.Lat,host.Long,host.HTel,simulatorlist.firstimage FROM booking LEFT JOIN bookinglist ON booking.BookingID = bookinglist.BookingID LEFT JOIN simulatorschedule ON bookinglist.ScheduleID = simulatorschedule.ScheduleID " +
			"LEFT JOIN simulatorlist ON booking.SimID = simulatorlist.SimID LEFT JOIN host ON simulatorlist.HostId = host.HostID WHERE booking.bookingid = ? AND customerid = ? ORDER BY simulatorschedule.StartTime";
		const [rows] = await connection.query(sql, [bookingId, customerId]);
		return rows;
	} catch (error) {
		console.error("Error in scheduleFromBookingIDDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function checkScheduleDB(bookingData) {
	const connection = await pool.getConnection();
	try {
		const values = bookingData.scheduleid;
		const placeholders = values.map(() => "?").join(",");
		const sql = `SELECT COUNT(*) FROM simulatorschedule WHERE SimID = ? AND ScheduleID IN  (${placeholders}) AND Available = 1`;
		const [rows] = await connection.query(sql, [bookingData.simid, ...values]);

		return rows[0]["COUNT(*)"] == bookingData.scheduleid.length;
	} catch (error) {
		console.error("Error in checkScheduleDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function bookingSimDB(bookingData) {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction(); // Start transaction

		const values = bookingData.scheduleid;
		const placeholders = values.map(() => "?").join(",");
		const sqlPrice = `SELECT SUM(Price) FROM simulatorschedule WHERE SimID = ? AND ScheduleID IN (${placeholders})`;
		const [rowsPrice] = await connection.query(sqlPrice, [
			bookingData.simid,
			...values,
		]);

		if (rowsPrice[0]["SUM(Price)"] == null) {
			throw new Error("Price is null");
		}

		const sql =
			"INSERT INTO booking ( SimID, CustomerID , TotalPrice) VALUES ( ?, ?, ?)";
		const [rows] = await connection.query(sql, [
			bookingData.simid,
			bookingData.customerid,
			rowsPrice[0]["SUM(Price)"],
		]);

		if (rows.affectedRows === 0) {
			throw new Error("Failed to insert booking");
		}

		const sqlbookingList =
			"INSERT INTO bookinglist (BookingID, ScheduleID) VALUES ?";
		const [rowsbookingList] = await connection.query(sqlbookingList, [
			bookingData.scheduleid.map((scheduleid) => [rows.insertId, scheduleid]),
		]);
		if (rowsbookingList.affectedRows === 0) {
			throw new Error("Booking list insertion failed");
		}

		await connection.commit();
		return [rows.insertId, true];
	} catch (error) {
		console.error("Error in bookingSimDB:", error);
		await connection.rollback();
		return [-1, false];
	} finally {
		connection.release();
	}
}

export async function cancelBookByCustomer(bookingID, customerID) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"UPDATE booking SET StatusID = 3 WHERE BookingID = ? AND CustomerID = ? AND StatusID = 1";

		const [result] = await connection.query(sql, [bookingID, customerID]);

		return result;
	} catch (error) {
		console.error("Error in cancelBookByCustomer:", error);
		return false;
	} finally {
		connection.release();
	}
}
// Host functions

async function hostBookingFromSimIDDB(simid, hostid) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM simulatorlist LEFT JOIN booking ON simulatorlist.simid = booking.simid LEFT JOIN bookingstatus ON booking.StatusID = bookingstatus.StatusID WHERE simulatorlist.simid = ? AND simulatorlist.hostid = ?";
		const [rows] = await connection.query(sql, [simid, hostid]);
		return rows;
	} catch (error) {
		console.error("Error in hostBookingFromSimIDDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function hostScheduleFromSimIDDB(simid, hostid) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM simulatorlist LEFT JOIN simulatorschedule ON simulatorlist.SimID = simulatorschedule.SimID INNER JOIN bookinglist ON simulatorschedule.ScheduleID = bookinglist.ScheduleID  WHERE simulatorlist.SimID = ? AND simulatorlist.hostid = ? ";
		const [rows] = await connection.query(sql, [simid, hostid]);
		return rows;
	} catch (error) {
		console.error("Error in hostScheduleFromSimIDDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

async function hostScheduleFromBookingIDDB(bookingId, simid, hostid) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"SELECT * FROM booking LEFT JOIN bookinglist ON booking.BookingID = bookinglist.BookingID LEFT JOIN simulatorschedule ON bookinglist.ScheduleID = simulatorschedule.ScheduleID LEFT JOIN simulatorlist ON booking.SimID = simulatorlist.SimID WHERE booking.bookingid = ? AND simulatorlist.simid = ? AND simulatorlist.hostid = ? ORDER BY simulatorschedule.StartTime";
		const [rows] = await connection.query(sql, [bookingId, simid, hostid]);
		return rows;
	} catch (error) {
		console.error("Error in hostScheduleFromBookingIDDB:", error);
		return false;
	} finally {
		connection.release();
	}
}

export async function hostConfirmBookingDB(bookingId, simid) {
	const connection = await pool.getConnection();
	try {
		const sql =
			"UPDATE booking SET StatusID = 2 WHERE BookingID = ? AND SimID = ? AND StatusID = 1";
		const [rows] = await connection.query(sql, [bookingId, simid]);
		return rows;
	} catch (error) {
		console.error("Error in hostConfirmBookingDB:", error);
		return false;
	}
}

export async function hostUploadSimulatorDB(simData, file1, file2, file3) {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();
		const sql =
			"INSERT INTO simulatorlist (simlistname,priceperhour,listdescription,hostid,modid,firstimage,secondimage,thirdimage) VALUE (?,?,?,?,?,?,?,?)";
		const [rows] = await connection.query(sql, [
			simData.simlistname,
			simData.priceperhour,
			simData.listdescription,
			simData.hostid,
			simData.modid,
			file1,
			file2,
			file3,
		]);
		if (rows.affectedRows === 0) {
			throw new Error("Failed to insert simulatorlist");
		}
		const simid = rows.insertId;
		const sqlType =
			"INSERT INTO simulatortypelist (simid,simtypeid) VALUES (?,?)";
		const [rowsType] = await connection.query(sqlType, [
			simid,
			simData.simtypeid,
		]);
		if (rowsType.affectedRows === 0) {
			throw new Error("Failed to insert simulatortypelist");
		}

		await connection.commit();

		return [simid, true];
	} catch (error) {
		console.error("Error in hostUploadSimulator:", error);
		await connection.rollback();
		return [-1, false];
	} finally {
		connection.release();
	}
}

export {
	initSQL,
	getUserByID,
	userLoginDB,
	userRegisterDB,
	hostLoginDB,
	hostRegisterDB,
	gethostByID,
	productAllDB,
	scheduleFromSimIDDB,
	bookingFromCustomerIDDB,
	scheduleFromBookingIDDB,
	hostBookingFromSimIDDB,
	hostScheduleFromBookingIDDB,
	hostScheduleFromSimIDDB,
	bookingSimDB,
	productidDB,
	checkScheduleDB,
};
