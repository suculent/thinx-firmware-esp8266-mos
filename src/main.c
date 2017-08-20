#include "mgos.h"
#include "mjs.h"

static void wifi_cb(enum mgos_net_event ev,
                    const struct mgos_net_event_data *ev_data, void *arg) {
  if (ev_data->if_type != MGOS_NET_IF_TYPE_WIFI) return;
  LOG(LL_INFO, ("WiFi change event: %d, arg %p", (int) ev, arg));
}

static void wifi_scan_cb(int n, struct mgos_wifi_scan_result *res, void *arg) {
  LOG(LL_INFO, ("WiFi scan result: SSIDs %d, arg %p, results:", n, arg));
  for (int i = 0; i < n; i++) {
    LOG(LL_INFO, ("  SSID: %-32s, auth: %2d, channel: %2d, RSSI: %2d",
                  res[i].ssid, res[i].auth_mode, res[i].channel, res[i].rssi));
  }
  LOG(LL_INFO, ("WiFi scan done."));
}

enum mgos_app_init_result mgos_app_init(void) {
  mgos_net_add_event_handler(wifi_cb, NULL);
  //mgos_wifi_scan(wifi_scan_cb, NULL);
  return MGOS_APP_INIT_SUCCESS;
}


uint8_t * mac_uin8t;
char mac_str[64];

void get_mac_address (uint8_t * mac_uin8t, char * mac_str)
{
    device_get_mac_address(mac_uin8t);
    *mac_uin8t=0x5C;                //Originally informs 5E (AP MAC ADDRESS)
    *(mac_uin8t+1)=0xCF;                            //Not really necessary
    *(mac_uin8t+2)=0x7F;                            //Not really necessary
    sprintf(mac_str, "%02x%02x%02x%02x%02x%02x\n", mac_uin8t[0]&0xFF,mac_uin8t[1]&0xFF,mac_uin8t[2]&0xFF,mac_uin8t[3]&0xFF,mac_uin8t[4]&0xFF,mac_uin8t[5]&0xFF);
    puts(mac_string);
}

char * get_mac_address()
{
    device_get_mac_address(mac_uin8t);
    //*mac_uin8t=0x5C;                //Originally informs 5E (AP MAC ADDRESS)
    //*(mac_uin8t+1)=0xCF;                            //Not really necessary
    //*(mac_uin8t+2)=0x7F;                            //Not really necessary
    sprintf(mac_str, "%02x%02x%02x%02x%02x%02x\n", mac_uin8t[0]&0xFF,mac_uin8t[1]&0xFF,mac_uin8t[2]&0xFF,mac_uin8t[3]&0xFF,mac_uin8t[4]&0xFF,mac_uin8t[5]&0xFF);
    return mac_str;
}
