#include "mgos.h"
#include "mjs.h"

enum mgos_app_init_result mgos_app_init(void) {
  return MGOS_APP_INIT_SUCCESS;
}

char * get_mac_address ()
{
    uint8_t * mac_uin8t;
    device_get_mac_address(mac_uin8t);
    *mac_uin8t=0x5C;                //Originally informs 5E (AP MAC ADDRESS)
    *(mac_uin8t+1)=0xCF;                            //Not really necessary
    *(mac_uin8t+2)=0x7F;                            //Not really necessary
    sprintf(mac_str, "%02x%02x%02x%02x%02x%02x\n", mac_uin8t[0]&0xFF,mac_uin8t[1]&0xFF,mac_uin8t[2]&0xFF,mac_uin8t[3]&0xFF,mac_uin8t[4]&0xFF,mac_uin8t[5]&0xFF);
    char * mac_str;
    puts(mac_string);
    return mac_str;
}
