load("api_http.js");


// -->

// API Key/owner for testing libs
THINX_API_KEY =
  "88eb20839c1d8bf43819818b75a25cef3244c28e77817386b7b73b043193cef4";
THINX_OWNER =
  "cedc16bb6bb06daaa3ff6d30666d91aacd6e3efbf9abbc151b4dcade59af7c12";
THINX_ALIAS = "nodemcu-lua-test";

THINX_COMMIT_ID = "fb5e1c8755d12f3d32e86f1d24f68294952077b1";
THINX_FIRMWARE_VERSION_SHORT = "0.0.1";
THINX_FIRMWARE_VERSION = "thinx-esp8266-mos-" + THINX_FIRMWARE_VERSION_SHORT;
THINX_UDID = "";

THINX_CLOUD_URL = "thinx.cloud"; // can change to proxy (?)
THINX_MQTT_URL = "thinx.cloud"; // should try thinx.local first for proxy
THINX_AUTO_UPDATE = true; //
THINX_MQTT_PORT = 1883; //
THINX_API_PORT = 7442; // use 7443 for https
THINX_PROXY = "thinx.local"; //
THINX_PLATFORM = "mongoose"; //

THINX_APP_VERSION = "1.0.0";

// end of machine-generated code

THINX_ENV_SSID = 'THiNX-IoT';
THINX_ENV_PASS = '<enter-your-ssid-password>';

// <-- will be replaced with data from thinx.json

// TODO: read from thinx.json
var data = require("thinx.json");
var xata = load("thinx.json");

console.log(JSON.stringify(cfg));

///

// can it LET?
var thx_connected_response = "{ \"status\" : \"connected\" }";
var thx_disconnected_response = "{ \"status\" : \"disconnected\" }";
var thx_reboot_response = "{ \"status\" : \"rebooting\" }";
var thx_update_question =
  "{ title: \"Update Available\", body: \"There is an update available for this device. Do you want to install it now?\", type: \"actionable\", response_type: \"bool\" }";
var thx_update_success =
  "{ title: \"Update Successful\", body: \"The device has been successfully updated.\", type: \"success\" }";

///

function thinx_device_mac() {
  return "NO:NM:OC:KE:D_"; // todo, replace with real non-mocked MAC
}

function registration_json_body() {
  return {
    registration: {
      mac: thinx_device_mac(),
      firmware: THINX_FIRMWARE_VERSION,
      commit: THINX_COMMIT_ID,
      version: THINX_FIRMWARE_VERSION_SHORT,
      checksum: THINX_COMMIT_ID,
      alias: THINX_ALIAS,
      udid: THINX_UDID,
      owner: THINX_OWNER,
      platform: "mongoose"
    }
  };
}

// Hardcoded registration process
function thinx_register() {
  //restore_device_info()

  HTTP.query({
    url: 'http://thinx.cloud:7442/device/register',
    headers: {
      'Authentication': THINX_API_KEY,
      'Accept': 'application/json',
      'Origin': 'device',
      'Content-Type': 'application/json',
      'User-Agent': 'THiNX-Client'
    },
    data: registration_json_body(),
    success: function(body, full_http_msg) {
      print(body);
    },
    error: function(err) {
      print(err);
    },
  });
}
