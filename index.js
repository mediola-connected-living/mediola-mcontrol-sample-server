var mcontrol = require('./mControl.js');

//sample devices
//mediola mControl device names are {group}.{name}
const devices = {
    "bedroom.light": 50,    //indicates 50 percent
    "kitchen.light": "on"
};

//create and start server on port 8098
var server = new mcontrol.Server(8098);
server.on("request", function(req, res) {

    if (req.name == "ExecuteCommand")
    {
        if (req.param.name == "command" && req.param.value)
        {
            var vp = req.param.value.split(".");
            //value is {group}.{name}.{function}
            if (vp.length == 3)
            {
                var device = vp[0]+"."+vp[1];
                var command = vp[2];

                //change state of sample device
                devices[device] = command;
                console.log("execute command: "+device+" -> "+command);
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
