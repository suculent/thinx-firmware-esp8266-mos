load("api_http.js");
load("api_file.js");
load('api_timer.js');

//print("Importing JSON:");
let thx = JSON.parse(File.read('conf5.json'));
//print("JSON:");
//print(JSON.stringify(thx));

///

// can it LET?
let thx_connected_response = {
  status: "connected"
};
let thx_disconnected_response = {
  status: "disconnected"
};
let thx_reboot_response = {
  status: "rebooting"
};
let thx_update_question = {
  title: "Update Available",
  body: "There is an update available for this device. Do you want to install it now?",
  type: "actionable",
  response_type: "bool"
};
let thx_update_success = {
  title: "Update Successful",
  body: "The device has been successfully updated.",
  type: "success"
};

///

function thinx_device_mac() {
  let f = ffi('char * get_mac_address()');
  return f(); // "N0:NM:OC:KE:D1:00"; // todo, replace with real non-mocked MAC
}

function registration_json_body() {
  return {
    registration: {
      mac: thinx_device_mac(),
      firmware: thx.THINX_FIRMWARE_VERSION,
      commit: thx.THINX_COMMIT_ID,
      version: thx.THINX_FIRMWARE_VERSION_SHORT,
      checksum: thx.THINX_COMMIT_ID,
      alias: thx.THINX_ALIAS,
      udid: thx.THINX_UDID,
      owner: thx.THINX_OWNER,
      platform: "mongoose"
    }
  };
}

// Hardcoded registration process
function thinx_register() {
  //restore_device_info()
  print("Registering...");
  HTTP.query({
    url: 'http://thinx.cloud:7442/device/register',
    headers: {
      'Authentication': thx.THINX_API_KEY,
      'Accept': 'application/json',
      'Origin': 'device',
      'Content-Type': 'application/json',
      'User-Agent': 'THiNX-Client'
    },
    data: registration_json_body(),
    success: function(body, full_http_msg) {
      print(body);

      let json = JSON.parse(body);
      print(JSON.stringify(json));
      let reg = json['registration'];
      if (reg) {

        let udid = reg['udid'];
        if (udid) {
          print(JSON.stringify(reg));
          thx.THINX_UDID = udid;
          print("Saving UDID: ");
          print(reg['udid']);
          let data = JSON.stringify(thx);
          File.write(data, "conf5.json");
        }
      }

    },
    error: function(err) {
      print(err);
      thinx_register();
    },
  });
}

Timer.set(60000 /* 1 sec */ , true /* repeat */ , function() {
  // Retry registration until UDID given
  //if (thx.THINX_UDID === "") {
  thinx_register();
  //}
}, null);


Timer.set(15000 /* 1 sec */ , true /* repeat */ , function() {
  thinx_register();
}, null);
