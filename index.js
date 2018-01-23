var mcontrol = require('./mControl.js');

//sample devices
//mediola mControl device names are {group}.{name}
var devices = {
    "bedroom.light": 50,    //indicates 50 percent
    "kitchen.light": "on"
};

//create and start server on port 8098
var server = new mcontrol.Server(8098);
server.on("request", function(req, res) {

    if (req.name == "ExecuteCommand")
    {
        for (var p in req.param)
        {
            if (req.param[p].name == "command" && req.param[p].value)
            {
                //value is {group}.{name}.{function}
                var vp = req.param[p].value.split(".");
                if (vp.length == 3)
                {
                    var device = vp[0]+"."+vp[1];
                    var command = vp[2];

                    //change state of sample device
                    devices[device] = command;
                    console.log("execute command: "+device+" -> "+command);
                }
            }
        }

        //always return success after executing command
        res.addResponse("status", "success");
    }
    else if (req.name == "GetStates")
    {
        console.log("get states");

        //just return state of sample device
        for (var p in req.param)
        {
            res.addResponse(req.param[p].name, devices[req.param[p].value]);
        }
    }

    res.send();
});
server.on("error", function(err) {
    console.log(err.toString());
});

server.start(function() {
    console.log("started server...");
});
