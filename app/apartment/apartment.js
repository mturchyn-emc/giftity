module.exports = function (app) {

    app.post('/apartments',     function (req, res) {
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, conn) {
            var data = {
                user_id: req.user.id,
                name: input.title,
                description: input.title,
                number_of_rooms: input.numberOfRooms,
                square_meters: input.squareMeters
            };
            conn.query("INSERT INTO Apartment set ? ", data, function (err, rows) {
                if (err) {
                    console.log("Error inserting : %s ", err);
                    res.status(500);
                } else {
                    readOne(req, res, rows.insertId);

                }
            });
        })
    });
    app.put ('/apartments/:id', function (req, res) {
        var input = JSON.parse(JSON.stringify(req.body));
        var apartmentId = req.params.id;
        req.getConnection(function (err, conn) {
            var data = {
                name: input.title,
                description: input.title,
                number_of_rooms: input.number_of_rooms,
                square_meters: input.square_meters
            };
            conn.query("UPDATE Apartment set ? WHERE user_id = ? AND id = ?", [data, req.user.id, apartmentId], function (err, rows) {
                if (err) {
                    console.log("Error inserting : %s ", err);
                    res.status(500);
                } else {
                    readOne(req, res, apartmentId);

                }
            });
        });
    });
    app.get ('/apartments',     function(req, res) {
        req.getConnection(function (err, conn) {
            conn.query("SELECT * from Apartment where user_id = ?", req.user.id, function (err, rows) {
                var apartments = [];
                for (var i = 0; i < rows.length; i++) {
                    var apartment = rows[i];
                    apartments.push({
                        id: apartment.id,
                        name: apartment.name,
                        description: apartment.description,
                        number_of_rooms: apartment.number_of_rooms,
                        square_meters: apartment.square_meters,
                        current: apartment.current
                    })

                }
                res.header("content-type: application/json");
                res.json(apartments)
            });
        });

    });
    app.get ('/apartments/:id', function(req, res, apartmentId) {
        req.getConnection(function (err, conn) {
            conn.query("SELECT * from Apartment where user_id = ? AND id = ?", [req.user.id, apartmentId], function (err, rows) {
                var apartment = rows[0];
                res.json({
                    id: apartment.id,
                    name: apartment.name,
                    description: apartment.description,
                    number_of_rooms: apartment.number_of_rooms,
                    square_meters: apartment.square_meters,
                    current: apartment.current
                })
            });
        });
    });


    var read = function (req, res) {
        readOne(req, res, req.params.id);

    };



};