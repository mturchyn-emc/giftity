module.exports = function (app, pool) {

    /** Create events. **/

    app.post('/api/events', function (req, res, next) {
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function (err, conn) {
            var data = {
                author: req.user.id,
                title: input.title,
                description: input.description,
                event_date: input.eventDate,
                event_type: input.eventType
            };
            conn.query("INSERT INTO Events set ? ", data, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    readEvent(rows.insertId, req.user.id, function(err, event) {
                        if (err) {
                            next(err);
                        } else {
                            res.json(event);
                        }
                    });
                }
            });
            conn.release();
        })
    });

    /** Get event types. **/

    app.get ('/api/event_types', function(req, res, next) {
        pool.getConnection(function (err, conn) {
            conn.query("SELECT * from EventType",function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    res.header("content-type: application/json");
                    res.json(rows);
                }

            });
            conn.release();
        });

    });

    /** Get list of events. **/

    app.get ('/api/events', function(req, res, next) {
        pool.getConnection(function (err, conn) {
            conn.query("SELECT * from Events where author = ?", req.user.id, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    var events = [];
                    for (var i = 0; i < rows.length; i++) {
                        var event = rows[i];
                        events.push({
                            id: event.id,
                            title: event.title,
                            description: event.description,
                            event_date: event.event_date,
                            event_type: event.event_type
                        })
                    }
                    res.header("content-type: application/json");
                    res.json(events)
                }
                conn.release();

            });
        });

    });

    /** Get basic event info. **/

    app.get ('/api/events/:id', function(req, res, eventId, next) {
        readEvent(eventId, req.user.id, function(err, event) {
           if (err) {
               next(err);
           } else {
               res.json(event);
           }
        });
    });

    function readEvent(eventId, userId, cb) {
        pool.getConnection(function (err, conn) {
            conn.query("SELECT * from Events where author = ? and id = ?", [userId, eventId], function (err, rows) {
                if (err) {
                    cb(err, null);
                } else if (rows.length == 0) {
                    cb(null, null);
                } else {
                    var event = rows[0];
                    cb(null, {
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        event_date: event.event_date,
                        event_type: event.event_type
                    });
                }
            });
            conn.release();
        });
    }

};