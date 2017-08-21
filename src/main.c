#include "mgos.h"
#include "mjs.h"
#include "strings.h"

/*
void get_mac_address (uint8_t * mac_uin8t, char * mac_str)
{
    device_get_mac_address(mac_uin8t);
    *mac_uin8t=0x5C;                //Originally informs 5E (AP MAC ADDRESS)
    *(mac_uin8t+1)=0xCF;                            //Not really necessary
    *(mac_uin8t+2)=0x7F;                            //Not really necessary
    sprintf(mac_str, "%02x%02x%02x%02x%02x%02x\n", mac_uin8t[0]&0xFF,mac_uin8t[1]&0xFF,mac_uin8t[2]&0xFF,mac_uin8t[3]&0xFF,mac_uin8t[4]&0xFF,mac_uin8t[5]&0xFF);
    puts(mac_string);
}*/

//void foo(int x) {
//  printf("Hello %d!\n", x);
//}

char * get_mac_address()
{
    uint8_t * mac_uin8t = NULL;
    char * mac_str = "ABCDEFGHIJKLMNOP";
    printf("device_get_mac_address() begin >");
    device_get_mac_address(mac_uin8t);
    printf("device_get_mac_address() end <");
    *mac_uin8t=0x5C;                //Originally informs 5E (AP MAC ADDRESS)
    *(mac_uin8t+1)=0xCF;                            //Not really necessary
    *(mac_uin8t+2)=0x7F;                            //Not really necessary
    sprintf(mac_str, "%02x%02x%02x%02x%02x%02x\n", mac_uin8t[0]&0xFF,mac_uin8t[1]&0xFF,mac_uin8t[2]&0xFF,mac_uin8t[3]&0xFF,mac_uin8t[4]&0xFF,mac_uin8t[5]&0xFF);
    puts(mac_str);
    printf("== MAC: %s", mac_str);
    return mac_str;
}

void *this_dlsym(void *handle, const char *name) {
  if (strcmp(name, "get_mac_address") == 0) return get_mac_address;
  // if (strcmp(name, "foo") == 0) return foo;
  return NULL;
}

enum mgos_app_init_result mgos_app_init(void) {
  struct mjs *mjs = mjs_create();
  mjs_set_ffi_resolver(mjs, this_dlsym);
  //mjs_exec(mjs, "let f = ffi('void foo(int)'); f(1234)", NULL);
  return MGOS_APP_INIT_SUCCESS;
}
