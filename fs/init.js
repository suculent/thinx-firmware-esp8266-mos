/* jshint esversion: 6 */

load("api_http.js");
load("api_file.js");
load('api_timer.js');
load('api_rpc.js');
load("api_config.js");

let cfg_file = File.read('conf5.json');
let thx = JSON.parse(cfg_file);

let useProxy = true;
let thx_thinx_proxy = thx.THINX_PROXY; // should be your proxy IP otherwise Mongoose will resolve using 8.8.8.8 and fail

///

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
  return thx.MAC; // rest crashes, MAC is hardcoded until someone helps
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
      platform: 'mongoose'
    }
  };
}

function headers() {
  return {
    'Authentication': thx.THINX_API_KEY,
    'Accept': 'application/json',
    'Origin': 'device',
    'Content-type': 'application/json',
    'User-Agent': 'THiNX-Client'
  };
}

// Hardcoded registration process
function thinx_register() {
  //restore_device_info()
  print("Registering...");

  let url = "http://thinx.cloud:7442/device/register";
  if (useProxy) {
    url = "http://" + thx_thinx_proxy + ":7442/device/register";
    print("Trying proxy..." + url);
  } else {
    url = "http://207.154.230.212:7442/device/register";
    print("Trying cloud..." + url);
  }
  //207.154.230.212
  print(JSON.stringify(registration_json_body()))
  HTTP.query({
    url: url,
    headers: headers(),
    data: registration_json_body(),
    success: function(body, full_http_msg) {

      if (body === "no_registration_info") {
        print("The code is wrong. Let's fix it.");

        return;
      } else {
        print(full_http_msg);
      }

      print("Registration response:");
      print(body);

      let json = JSON.parse(body);
      print(JSON.stringify(json));
      let reg = json.registration;
      if (reg) {
        let udid = reg.udid;
        if (udid) {
          print(JSON.stringify(reg));
          thx.THINX_UDID = udid;
          print("Saving UDID: ");
          print(reg.udid);
          let data = JSON.stringify(thx);
          File.write(data, "conf5.json");
          // Sys.reboot();
        }
      }

    },
    error: function(err) {
      print("Registration error:");
      print(JSON.stringify(err));
      useProxy = !useProxy;
      thinx_register(useProxy);
    },
  });
}

// Monitor network connectivity.
Net.setStatusEventHandler(function(ev, arg) {
  let evs = "???";
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = "DISCONNECTED";
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = "CONNECTING";
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = "CONNECTED";
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = "GOT_IP";

    // Get MAC and register with THiNX
    let rpc_local = " " + Cfg.get("device.id");

    let esp32 = rpc_local.slice(1, 7);
    if (esp32 === "esp32_") {
      thx.MAC = "5ECF7F" + rpc_local.slice(7, 13); // esp32_
    }

    let esp8266 = rpc_local.slice(1, 9);
    if (esp8266 === "esp8266_") {
      thx.MAC = "5CCF7F" + rpc_local.slice(9, 15); // esp8266_
    }

    if (thx.MAC !== "") {
      thinx_register(useProxy);
    }
  }
}, null);

// FFI example that simply works
// let f = ffi('void foo(int)');
// f(1234);
