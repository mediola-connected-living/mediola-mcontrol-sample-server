var net = require('net'),
    xml2js = require('xml2js');

mControlResponse = function(connection)
{
    this._connection = connection; 
    this._responses = {};
}
mControlResponse.prototype.addResponse = function(name, value)
{
    this._responses[name] = value;
}
mControlResponse.prototype.send = function()
{
    var response = '<?xml version="1.0"?>\n<mctrlmessage>\n<response>\n';
    for (var r in this._responses)
        response += '<return name="'+r+'" value="'+this._responses[r]+'" />\n';
    response += '</response>\n</mctrlmessage>\n';

    var message = "XML\n";
    message += ("00000000"+response.length).slice(-8)+"\n";
    message += response;

    this._connection.write(message);
}

mControlServer = function(port)
{
    this._port = port;
    this._server = null;

    this._onRequestCallback = null;
    this._onErrorCallback = null;
}
mControlServer.prototype.on = function(handler, callback) 
{
    if (handler == "request")
        this._onRequestCallback = callback;
    if (handler == "error")
        this._onErrorCallback = callback;
}
mControlServer.prototype._handleRequest = function(req, connection) 
{
    if (req && req["mctrlmessage"] && req["mctrlmessage"]["request"] && this._onRequestCallback)
        this._onRequestCallback(req["mctrlmessage"]["request"], new mControlResponse(connection));
}
mControlServer.prototype.start = function(callback) 
{
    var self = this;
    this._server = net.createServer(function (c) {

        c.on('data', function(data) {
            //ommit header parsing for simplified testserver
            //-> a real world implementation should parse incoming request and wait for all bytes as indicated in message header
            var s = data.toString();
            if (s.indexOf('<?xml version="1.0"?>') > 0)
            {
                var parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false});
                parser.parseString(s.substr(s.indexOf('<?xml version="1.0"?>')+22), function(err, result) {
                    self._handleRequest(result, c);
                });
            }
        });
        c.on('end', function() {
        });
    });
    this._server.on('error', function(err) {
        if (self._onErrorCallback)
            self._onErrorCallback(err);
    });
    this._server.listen(this._port, function() {
        if (callback)
            callback();
    });
}

exports.Server = mControlServer;
