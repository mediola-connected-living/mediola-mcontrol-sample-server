# mediola mControl node.js sample server

A simplified node.js implementation of the mediola mControl server protocol intended for demonstration purposes.

For more information about the usage and integration of the mControl protocol in AIO CREATOR NEO you can download the following file from the mediola website:  
http://doku.mediola.com/lib/exe/fetch.php?media=de:creator:how-to-use-mcontrol.pdf


## mControl communication protocol

A mControl message always consists of a header followed by some XML which carries all the information to
execute commands and obtain states. 

For requests a 3 line header is used:

```
MCM:PLUGIN
XML
XXXXXXXX
```

While line 1 and 2 are always identical, the third line defines the length of the message and needs to be set correctly (always 8 characters long, if necessary filled with leading ```0```s) for the message to be valid.  
Every line of the header has to end with a line feed (```\n```).

For responses a 2 line haeder is used:

```
XML
XXXXXXXX
```

The 2 lines of the response header correspond to the last 2 lines of request header, so the same rules apply here.


### Execute a command

The following sample message (sent by the remote) executes a command:

```
MCM:PLUGIN
XML
00000164
<?xml version="1.0"?>
<mctrlmessage>
<request name="ExecuteCommand" module="hcontrol">
<param name="command" value="kitchen.light.on" />
</request>
</mctrlmessage>
```

The ```param``` element of the XML message contains the relevant information:  
```name```: always set to "command" to execute a command  
```value```: command to execute (composed of group, device and command)  

The server responds to such an "ExecuteCommand" request with the following message:

```
XML
00000117
<?xml version="1.0"?>
<mctrlmessage>
<response>
<return name="status" value="success" />
</response>
</mctrlmessage>
```

Because the client (remote) only checks for a valid response and does not check for different return values,
the content of the response can always be identical to the shown message.


### Get states

The following sample message (sent by the remote) queries for device states:

```
MCM:PLUGIN
XML
00000236
<?xml version="1.0"?>
<mctrlmessage>
<request name="GetStates" module="hcontrol">
<param name="mcontrol.Küche:state" value="kitchen.light" />
<param name="mcontrol.Schlafzimmer:state" value="bedroom.light" />
</request>
</mctrlmessage>
```

The ```param``` element of the XML message contains the relevant information:  
```name```: name of device as set up in the remote  
```value```: device id (composed of group and device)  

Because the states of a remote page are always requested by one single message, the
param element may occur several times in one message.

To a request message like above, the server responds as follows:

```
XML
00000183
<?xml version="1.0"?>
<mctrlmessage>
<response>
<return name="mcontrol.Küche:state" value="on" />
<return name="mcontrol.Schlafzimmer:state" value="50" />
</response>
</mctrlmessage>
```

The ```return``` element of the XML message contains the relevant information:  
```name```: name of device as set up in the remote  
```value```: current state of the device  


## Run sample server locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/mediola-connected-living/node-js-mcontrol-sample-server.git
cd node-js-mcontrol-sample-server
npm install
npm start
```

The mControl sample server should now be running on port 8098.


## License

Copyright (c) 2018, mediola - connected living AG

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
